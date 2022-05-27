import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    // let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify({}),
    });
    // return res.send("get ");
  } catch (e) {
    console.log(e);
  }
};


let getCRUD = (req, res) => {
  try {
    return res.render("crud.ejs");
  } catch (e) {
    console.log(e);
  }
};

let postCRUD = async (req, res) => {
  let data = await CRUDservice.createNewUser(req.body);
  return res.render('displayCRUD.ejs', {
    dataTable: data
  });
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDservice.updateUserData(data);
  return res.render('displayCRUD.ejs', {
    dataTable: allUsers
  });

};

let displayCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();
  return res.render('displayCRUD.ejs', {
    dataTable: data
  });
}

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInforById(userId);
    if (userData) {
      return res.render('editCRUD.ejs', {
        user: userData
      });
    }
  }
  else {
    return res.send("User not found")
  }

}

let deleteCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let allUsers = await CRUDservice.deleteUserById(userId);
    return res.render('displayCRUD.ejs', {
      dataTable: allUsers
    });
  } else {
    return res.send("user not found")
  }

}



module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  putCRUD: putCRUD,
  displayCRUD: displayCRUD,
  getEditCRUD: getEditCRUD,
  deleteCRUD: deleteCRUD,
};
