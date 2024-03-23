const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const HttpError = require("../models/erroeModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//---------------REGISTER A NEW USER
//POST: api/user/register
//UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill in All Fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });

    if (emailExists) {
      return next(new HttpError("Email Already exist.", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password Should be Atleast 6 character.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password Doed not match.", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New User ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User Registration Failed.", 422));
  }
};

//---------------LOGIN A NEW USER
//POST: api/user/login
//UNPROTECTED

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Fill in All Fields.", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid Credentials.", 422));
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return next(new HttpError("Invalid Credentials.", 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET); //{expiresIn: "id"}
    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login Failed Please check your Credentials.", 422)
    );
  }
};

//---------------USER PROFILE
//POST: api/user/:id
//PROTECTED

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new HttpError("User not Found.", 404));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//---------------CHANGE USER AVATAR(profile picture)
//POST: api/user/change-avatar
//PROTECTED

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please Choose an Image.", 422));
    }

    //find user from database
    const user = await User.findById(req.user.id);

    //delete old Avatar if Exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }

    const { avatar } = req.files;
    //check file size
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture Too big. Should be less than 500kb"),
        422
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }
        const updateAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );
        if (!updateAvatar) {
          return next(new HttpError("Avatar could not be changed.", 422));
        }
        res.status(200).json(updateAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//---------------EDIT USER DETAILS(from profile)
//POST: api/user/edit-user
//PROTECTED

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Fill in All Fields.", 422));
    }

    //get user from Database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not Found.", 403));
    }

    //make sure new Email does not already Exist
    const emailExist = await User.findOne({ email });
    //we want to update other details with/without change the Email(which is a unique id because we use it to login )
    if (emailExist && emailExist._id != req.user.id) {
      return next(new HttpError("Email Already Exist.", 422));
    }

    //compare current password to db password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password.", 422));
    }

    //compare new password
    if (newPassword !== confirmNewPassword) {
      return next(new HttpError("New Password does not match", 422));
    }

    //hash new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    //update user in database
    const newInfo = await User.findByIdAndUpdate(req.user.id,{name, email, password: hash},{new:true});
    res.status(200).json(newInfo)
  } catch (error) {
    return next(new HttpError(error));
  }
};

//---------------GET AUTHORS
//POST: api/user/authors
//UNPROTECTED

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
