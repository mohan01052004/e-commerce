export const fileFilter = (req, file, cb) => {
  const isValidFile = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
  cb(null, isValidFile);
}