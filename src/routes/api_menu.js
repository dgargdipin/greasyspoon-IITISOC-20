const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Menu = require("../models/Menu");
const Dish = require("../models/Dish");
const {
    ensureAuthenticated,
    ensureCafe
} = require("../config/auth");
const upload = require('../config/multer_support')

const {
    Cafe
} = require('../models/Cafe')
//working api endpoint /api/menu
//returns list of all cafes
router.get('/', async (req, res) => {
    try {
        let cafeList = await Cafe.find().select({
            orders: 0,
            password: 0
        }).exec();
        res.status(200).json(cafeList);

    } catch (err) {
        res.status(500).json({
            error: err,
            err: err.message
        })
    }

});
router.get("/all", async (req, res) => {
    console.log('erearea')
    try {
        let menus = await Menu.find({}).exec();
        res.status(200).send(menus);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            err
        })
    }

})
//working
//returns menu of cafe with cafeid
router.get("/:cafeid", (req, res) => {
    Menu.findOne({
            cafe_id: req.params.cafeid,
        })
        .then((menu) => {
            if (menu) {
                res.json(menu);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => console.log(err.message));
});

router.post("/", ensureCafe, (req, res) => {
    console.log(req.body);
    let deepClone = JSON.parse(JSON.stringify(req.body));

    deepClone.cafe_id = req.user._id;
    deepClone.availability = (deepClone.availability == 'true');
    deepClone.featured = (deepClone.featured == 'true');
    console.log(req.user._id);
    Menu.findOneAndUpdate({
            cafe_id: req.user._id
        }, {
            $push: {
                items: deepClone,
            }
        }, {
            new: true,
            upsert: true
        },
        (err, workingMenu) => {
            if (err) {
                res.json({
                    'error': err.message
                })
            } else {
                res.status(200).json({
                    status: 'Added',
                    newMenu: workingMenu
                });
            }
        })
})

router.post("/withImage", ensureCafe, upload.single('dishImage'), (req, res) => {
    console.log(req.body);
    let deepClone = JSON.parse(JSON.stringify(req.body));
    console.log(req.file);
    if (req.file != undefined) {
        deepClone.pictureURL = req.file.path;
    }
    deepClone.cafe_id = req.user._id;
    deepClone.availability = (deepClone.availability == 'true');
    deepClone.featured = (deepClone.featured == 'true');
    console.log(req.user._id);
    Menu.findOneAndUpdate({
            cafe_id: req.user._id
        }, {
            $push: {
                items: deepClone,
            }
        }, {
            new: true,
            upsert: true
        },
        (err, workingMenu) => {
            if (err) {
                res.json({
                    'error': err.message
                })
            } else {
                res.status(200).json({
                    status: 'Added',
                    newMenu: workingMenu
                });
            }
        })
})
router.post("/onlyImage", ensureCafe, upload.single('dishImage'), async (req, res) => {
    try {
        console.log(req.body);
        let workingMenu = await Menu.findOne({
            cafe_id: req.user._id
        }).exec();
        if (!workingMenu) {
            res.status(404).json({
                error: 'Could not find the menu'
            })
        };

        let workingDish = await Menu.items.id(req.body.dish_id);
        if (!workingDish) {
            res.status(404).json({
                error: 'Could not find the dish'
            })
        }
        if (req.file != undefined) {
            workingDish.pictureURL = req.file.path;
        }
        let newMenu = await Menu.save()
        res.status(200).json({
            success: 'Updated the dish',
            menu
        })

    } catch (error) {
        console.log(error);
        return new Error(error);
    }

})




router.delete("/:dishID", ensureCafe, (req, res) => {

    Menu.findOneAndUpdate({
            cafe_id: req.user._id,
        }, {
            $pull: {
                items: {
                    _id: req.params.dishID
                }
            }
        }, {
            new: true
        },
        (err, response) => {
            if (!err) {
                res.status(200).json({
                    status: "deleted",
                    response: response
                });
            } else {
                res.status(500).json({
                    error: 'Unable to delete'
                });
            }
        }
    );
});

;
module.exports = router;