import { existsSync, mkdir } from 'fs';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  let fileName = `${name}-${randomName}${fileExtName}`;

  switch (file.fieldname) {
    case 'tax_back':
      fileName = `tax_document_back_${req.user.first_name}_${req.user.last_name}${fileExtName}`;
      break;
    case 'tax_front':
      fileName = `tax_document_front_${req.user.first_name}_${req.user.last_name}${fileExtName}`;
      break;
    case 'id_back':
      fileName = `id_document_back_${req.user.first_name}_${req.user.last_name}${fileExtName}`;
      break;
    case 'id_front':
      fileName = `id_document_front_${req.user.first_name}_${req.user.last_name}${fileExtName}`;
      break;
  }
  
  callback(null, fileName);
};

export const destinationPath = (req, file, callback) => {
  const nameRoute = req.route.path.replace(':id', '');

  const arrayPath = nameRoute.split('/');
  let savePath = '';

  switch (arrayPath[3]) {
    case 'documents-images':
      arrayPath.splice(4, 1);
      savePath = './files' + arrayPath.join('/') + '/' + req.user.id;
      break;

    default:
      savePath = './files/' + nameRoute;
      break;
  }

  if (!existsSync(savePath)) {
    mkdir(savePath, {
      recursive: true
    }, err => callback(err, savePath)
    );
  }

  callback(null, savePath);
};

