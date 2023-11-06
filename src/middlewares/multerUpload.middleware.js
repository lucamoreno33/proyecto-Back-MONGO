import multer from "multer";

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        const fileType = file.fieldname
        const uploadFolder = determineUploadFolder(fileType);
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    
});

function determineUploadFolder(fileType) {
    if (fileType === 'profile') {
        return 'uploads/profiles';
    } else if (fileType === 'product') {
        return 'uploads/products';
    } else if (fileType === 'document') {
        return 'uploads/documents';
    } else {
        return 'uploads/other';
    }
}

const upload = multer({ storage: storage });

export default upload;