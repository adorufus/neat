const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, callbacks) => {
        callbacks(null, './public/uploaded_image')
    },
    filename: (req, file, callbacks) => {
        callbacks(null, "proof-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

module.exports = upload