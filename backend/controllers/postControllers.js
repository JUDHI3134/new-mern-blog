const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/erroeModel");

//-------------CREATE A POST
//POST:api/posts
//PROTECTED
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(
        new HttpError("Required All fields and choose Thumbnail .", 422)
      );
    }

    const { thumbnail } = req.files;

    //check the file size

    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail Too Big. file size should less than 2mb")
      );
    }

    let fileName = thumbnail.name;
    let splittedfileName = fileName.split(".");
    let newFileName =
      splittedfileName[0] +
      uuid() +
      "." +
      splittedfileName[splittedfileName.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFileName,
            creator: req.user.id,
          });
          if (!newPost) {
            return next(new HttpError("Post CAn not be created..", 422));
          }

          //find user and increase post count by 1
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------GET ALL POST
//GET:api/posts
//UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------GET SINGLE POST
//GET:api/posts/:id
//UNPROTECTED
const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found..", 404));
    }
    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------GET POST by CATEGORY
//GET:api/posts/categories/:category
//PROTECTED
const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------GET USER/AUTHOR POST
//GET:api/posts/users/:id
//PROTECTED
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------EDIT POST
//PATCH:api/posts/:id
//PROTECTED
const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;

    //ReactQuill has a paragraph opening and closig tag with a breck tag in between so there are 11 character in there already
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in All fields..", 422));
    }

    
      //get old post from database
      const oldPost = await Post.findById(postId);

      if(req.user.id == oldPost.creator){
        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(
              postId,
              { title, category, description },
              { new: true }
            );
          } else {


      //delete old thumbnail from upload
      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );
      //upload new thumbnail
      const { thumbnail } = req.files;

      //check file size
      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("thumbnail Too big. should be less than 2mb")
        );
      }

      fileName = thumbnail.name;
      let splittedfileName = fileName.split(".");
      newFileName =
        splittedfileName[0] +
        uuid() +
        "." +
        splittedfileName[splittedfileName.length - 1];
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        }
      );

      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description, thumbnail: newFileName },
        { new: true }
      );
    }
  }
    if (!updatedPost) {
      return next(new HttpError("Could not Update Post"));
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//-------------DELETE POST
//DELETE:api/posts/:id
//PROTECTED
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post Unavailable..", 400));
    }
    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;

    if(req.user.id == post.creator){
    //delete thumbnail fro upload folder
    fs.unlink(path.join(__dirname, "..", "uploads", fileName), async (err) => {
      if (err) {
        return next(new HttpError(err));
      } else {
        await Post.findByIdAndDelete(postId);

        //find the user and reduce the post count by 1
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser?.posts - 1;
        await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});
      }
    });
}else{
    return next(new HttpError("Post Could't be Deleted..",403));
}
    res.json(`Post ${postId} deleted Successfully`)
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
