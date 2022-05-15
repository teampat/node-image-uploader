const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const app = express();
const port = 3000;
const crypto = require('crypto');
const YAML = require('yaml');

sharp.cache(false);

const random = () => crypto.randomBytes(10).toString('hex');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    let filename = file.originalname.toLowerCase();
    if (file.mimetype == 'image/jpeg') {
      filename = filename.replace('.jpeg', '.jpg');
    }
    cb(null, random() + path.extname(filename));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/webp' ||
      file.mimetype == 'image/avif' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'image/svg'
    ) {
      callback(null, true);
    } else {
      res.status(400).json({
        success: false,
        message: 'Input type file accept only images',
      });
    }
  },
});

app.post('/upload', upload.single('image'), async (req, res) => {
  
  const config = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
  
  let files = [];
 
  const { filename: image, buffer } = req.file;

  let extArray = image.split('.');

  if (
    req.file.mimetype == 'image/jpeg' &&
    config['file_types_output'].indexOf('jpg') !== -1
  ) {
    config.image_sizes.forEach(async (item) => {
      files.push({
        mimetype: 'image/jpeg',
        destination: `${req.file.destination}resize`,   
        size: item,
        path: `${req.file.destination}resize/${extArray[0]}-${item}.jpg`,
        filename: `${extArray[0]}-${item}.jpg`
      });
      await sharp(req.file.path)
        .resize({
          width: config['image_size_config'][`${item}`]['max_width'],
          height: config['image_size_config'][`${item}`]['max_height'],
          fit: item.search('-square') !== -1 ? sharp.fit.cover : sharp.fit.inside,
        })
        .jpeg({
          quality: config['file_type_config']['jpg']['quality'],
          mozjpeg: true,
        })
        .toFile(
          path.resolve(
            req.file.destination,
            'resize',
            `${extArray[0]}-${item}.jpg`
          )
        );
    });
  }

  if (
    req.file.mimetype == 'image/png' &&
    config['file_types_output'].indexOf('png') !== -1
  ) {
    config.image_sizes.forEach(async (item) => {
      files.push({
        mimetype: 'image/png',
        destination: `${req.file.destination}resize`,   
        size: item,
        path: `${req.file.destination}resize/${extArray[0]}-${item}.png`,
        filename: `${extArray[0]}-${item}.png`
      });
      await sharp(req.file.path)
        .resize({
          width: config['image_size_config'][`${item}`]['max_width'],
          height: config['image_size_config'][`${item}`]['max_height'],
          fit: item.search('-square') !== -1 ? sharp.fit.cover : sharp.fit.inside,
        })
        .png({
          compressionLevel:
            config['file_type_config']['png']['compression_level'],
          effort: 10,
        })
        .toFile(
          path.resolve(
            req.file.destination,
            'resize',
            `${extArray[0]}-${item}.png`
          )
        );
    });
  }

  if (
    (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') &&
    config['file_types_output'].indexOf('webp') !== -1
  ) {
    config.image_sizes.forEach(async (item) => {
      files.push({
        mimetype: 'image/webp',
        destination: `${req.file.destination}resize`,   
        size: item,
        path: `${req.file.destination}resize/${extArray[0]}-${item}.webp`,
        filename: `${extArray[0]}-${item}.webp`
      });
      await sharp(req.file.path)
        .resize({
          width: config['image_size_config'][`${item}`]['max_width'],
          height: config['image_size_config'][`${item}`]['max_height'],
          fit: item.search('-square') !== -1 ? sharp.fit.cover : sharp.fit.inside,
        })
        .webp({
          quality: config['file_type_config']['webp']['quality'],
          effort: 6,
        })
        .toFile(
          path.resolve(
            req.file.destination,
            'resize',
            `${extArray[0]}-${item}.webp`
          )
        );
    });
  }

  if (
    (req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png') &&
    config['file_types_output'].indexOf('avif') !== -1
  ) {
    config.image_sizes.forEach(async (item) => {
      files.push({
        mimetype: 'image/avif',
        destination: `${req.file.destination}resize`,   
        size: item,
        path: `${req.file.destination}resize/${extArray[0]}-${item}.avif`,
        filename: `${extArray[0]}-${item}.avif`
      });
      await sharp(req.file.path)
        .resize({
          width: config['image_size_config'][`${item}`]['max_width'],
          height: config['image_size_config'][`${item}`]['max_height'],
          fit: sharp.fit.inside,
        })
        .avif({ quality: 65, effort: 6, chromaSubsampling: '4:2:0' })
        .toFile(
          path.resolve(
            req.file.destination,
            'resize',
            `${extArray[0]}-${item}.avif`
          )
        );
    });
  }

  res.json({
    success: true,
    message: 'File Uploaded Successfully',
    data: {
      original: req.file,
      files,
    },
  });
});

app.listen(port, () => console.log(`listening on port ${port}!`));
