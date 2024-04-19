# One Piece Transcription API

This project is a RESTful API for managing a database of One Piece manga sagas, arcs, chapters, and pages. It provides endpoints for retrieving and searching One Piece manga transcriptions.

## Features

- Retrieve One Piece sagas, arcs, chapters, and pages with pagination
- Search for transcriptions within One Piece manga pages
- Efficiently store and retrieve One Piece manga data using MongoDB

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- MongoDB

### Download Content

You can download the "onepiece_contentn" file from the following link:
[onepiece_content](https://drive.google.com/file/d/1wP2XbkBwq0YtFpbbvcUhBAY82zgGZhxq/view)

The file contains comprehensive information about the One Piece manga series, including:

- **Volumes**: The file includes data about all the One Piece manga volumes released so far.
- **Sagas**: It provides information about the different sagas or story arcs in the One Piece manga series.
- **Arcs**: Within each saga, the file contains details about the individual story arcs.
- **Chapter Titles**: The titles of each chapter in the One Piece manga are included in the file.
- **Transcriptions**: The file includes transcriptions of the text content from all the pages of the One Piece manga.
- **Panel Detections**: Information about the detected panels on each manga page is provided.
- **Characters**: Information about the characters in the One Piece manga is provided from the wiki.


### Installation

1. Clone the repository:

   ```bash
    git clone https://github.com/your-username/one-piece-transcription-api.git
    ```

2. Install the dependencies:

   ```bash
    cd one-piece-transcription-api
    npm install
    ```

3. Set up the environment variables:

    Create a `.env` file in the root directory and provide the following variables:
    
    ```
    MONGO_USERNAME=your_mongodb_username
    MONGO_PASSWORD=your_mongodb_password
    ```

4. Start the server:

    ```bash
    npm start
    ```

    The API will be accessible at `http://localhost:3000`.



## API Endpoints

`/sagas` - Get all One Piece sagas with pagination
`/sagas/:id` - Get a specific One Piece saga by ID
`/sagas/:sagaId/arcs` - Get all arcs for a specific One Piece saga with pagination
`/arcs/:id` - Get a specific One Piece arc by ID
`/arcs/:arcId/chapters` - Get all chapters for a specific One Piece arc with pagination
`/chapters/:id` - Get a specific One Piece chapter by ID
`/chapters/:chapterId/pages` - Get all pages for a specific One Piece chapter with pagination
`/pages/:id` - Get a specific One Piece page by ID
`/search` - Search for transcriptions in One Piece pages

## Data Upload

To upload One Piece manga data to the database, run the following command:

```bash
node upload.js
```

This script reads data from the &grave;one_piece_sagas_with_chapters.json&grave; file and populates the database with One Piece sagas, arcs, chapters, and pages.

To reset the database and start the upload process from scratch, use the &grave;--reset&grave; flag:

```bash
node upload.js --reset
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
