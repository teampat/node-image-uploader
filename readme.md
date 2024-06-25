# Node Image Uploader

This is an Express.js API for uploading, compressing, resizing, and converting images. The API supports multiple image formats including JPEG, PNG, WebP, and AVIF. It uses `multer` for handling file uploads, `sharp` for image processing, and `yaml` for configuration.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/teampat/node-image-uploader.git
    cd node-image-uploader
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

## Configuration

The application uses a YAML configuration file (`config.yml`) for specifying output formats and image sizes. Ensure you have a `config.yml` file in the root directory with the following structure:

```yaml
image_size_config:
  thumbnail-crop:
    max_width: 512
    max_height: 512
  thumbnail:
    max_width: 768
    max_height: 768
  medium:
    max_width: 1024
    max_height: 1024
  large: 
    max_width: 2048
    max_height: 2048

file_type_config:
  jpg: 
    quality: 80
  webp: 
    quality: 75
  avif: 
    quality: 65
  png:
    compression_level: 9

image_sizes_output:
  - thumbnail-crop
  - thumbnail
  - medium
  - large

file_types_output:
  - jpg
  - png
  - webp
  - avif
```
Note: Require to add items to image_sizes_output and file_types_output for specific sizes and specific file types.

## Usage

1. Start the server:
    ```bash
    npm start
    ```

2. The server will start on port 3000. You can change the port by modifying the `port` variable in the `index.js` file.

## API Endpoints

### Upload Image

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Form Data**:
  - `image`: The image file to upload.

**Response**:
- `success`: Indicates whether the upload was successful.
- `message`: A message describing the result.
- `data`: An object containing details of the original file and the generated files.

**Example**:

```bash
curl -X POST http://localhost:3000/upload -F "image=@/path/to/image.jpg"
```
Note: uploads is the destination directory where the output images are stored.
