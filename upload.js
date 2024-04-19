const fs = require('fs');
const mongoose = require('mongoose');
const {
    Saga,
    Arc,
    Chapter,
    Page,
    Annotation,
    Text,
    CharacterCluster,
    TextCharacterAssociation,
} = require('./models/models');
require('dotenv').config();

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const DATABASE_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@subpiece.8sh2lge.mongodb.net/?retryWrites=true&w=majority&appName=SubPiece`;

const resetProgress = async () => {
    progress = {};
    console.log('Clearing existing data...');
    await Saga.deleteMany({});
    await Arc.deleteMany({});
    await Chapter.deleteMany({});
    await Page.deleteMany({});
    await Annotation.deleteMany({});
    await Text.deleteMany({});
    await CharacterCluster.deleteMany({});
    await TextCharacterAssociation.deleteMany({});
    console.log('Existing data cleared.');
    fs.writeFileSync(progressFilePath, JSON.stringify(progress));
};

// Read the sagas_names_with_chapters.json file
const sagasData = JSON.parse(fs.readFileSync('./sagas_names_with_chapters.json', 'utf8'));
const progressFilePath = './upload_progress.json';
let progress = {};
// Connect to MongoDB
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    try {
        const args = process.argv.slice(2);
        if (args.includes('--reset')) {
            await resetProgress();
        }

        try {
            progress = JSON.parse(fs.readFileSync(progressFilePath, 'utf8'));
        } catch (error) {
            console.log('No existing progress found. Starting from scratch.');
            progress = {};
        }

        // Iterate over each saga
        // Iterate over each saga
        for (let sagaIndex = progress.sagaIndex || 0; sagaIndex < sagasData.length; sagaIndex++) {
            const sagaData = sagasData[sagaIndex];
            //console.log(`Processing Saga: ${sagaData.sagaName} [${sagaIndex + 1}/${sagasData.length}]`);
            const saga = new Saga({
                sagaName: sagaData.sagaName,
                arcList: [],
            });

            // Iterate over each arc in the saga
            for (let arcIndex = progress.arcIndex || 0; arcIndex < sagaData.arcList.length; arcIndex++) {
                const arcData = sagaData.arcList[arcIndex];
                //console.log(`  Processing Arc: ${arcData.arcName} [${arcIndex + 1}/${sagaData.arcList.length}]`);
                const arc = new Arc({
                    arcName: arcData.arcName,
                    startChapter: arcData.startChapter,
                    endChapter: arcData.endChapter,
                    chapters: [],
                });

                // Iterate over each chapter in the arc
                for (let chapterIndex = progress.chapterIndex || 0; chapterIndex < arcData.chapters.length; chapterIndex++) {
                    const chapterData = arcData.chapters[chapterIndex];
                    //console.log(`    Processing Chapter: ${chapterData.chapterTitle} [${chapterIndex + 1}/${arcData.chapters.length}]`);
                    const chapter = new Chapter({
                        chapterNumber: chapterData.chapterNumber,
                        volumeNumber: chapterData.volumeNumber,
                        chapterTitle: chapterData.chapterTitle,
                        startPage: chapterData.startPage,
                        endPage: chapterData.endPage,
                        pages: [],
                    });

                    // Iterate over each page in the chapter
                    if (chapterData.pages) {
                        for (let pageIndex = progress.pageIndex || 0; pageIndex < chapterData.pages.length; pageIndex++) {
                            const pageData = chapterData.pages[pageIndex];
                                                        //process.stdout.write(`      Processing Page: ${pageData.filename} [${pageIndex + 1}/${chapterData.pages.length}]\r`);
                            const annotation = new Annotation(pageData.annotation);
                            const transcription = pageData.transcription ? pageData.transcription.map(text => new Text(text)) : [];
                            const page = new Page({
                                filename: pageData.filename,
                                annotation,
                                transcription,
                                page_number: pageData.page_number,
                            });

                            chapter.pages.push(page);

                            // Save the page to the database
                            //await page.save();

                            // Save progress
                            progress = {
                                sagaIndex,
                                arcIndex,
                                chapterIndex,
                                pageIndex,
                            };
                            fs.writeFileSync(progressFilePath, JSON.stringify(progress));
                        }
                    }

                    arc.chapters.push(chapter);
                    progress.pageIndex = 0; // Reset page index for the next chapter

                    // Save the chapter to the database
                    await chapter.save();
                    console.log(`- ${sagaData.sagaName} [${sagaIndex + 1}/${sagasData.length}], Arc: ${arcData.arcName} [${arcIndex + 1}/${sagaData.arcList.length}], Chapter: ${chapterData.chapterNumber} [${chapterIndex + 1}/${arcData.chapters.length}]`);

                    //console.log(`Chapter ${chapter.chapterTitle} saved successfully`);
                }

                saga.arcList.push(arc);
                // Reset chapter index for the next arc
                progress.chapterIndex = 0;
                fs.writeFileSync(progressFilePath, JSON.stringify(progress));

                // Save the arc to the database
                //await arc.save();
                //console.log(`Arc ${arc.arcName} saved successfully`);
            }

            // Save the saga to the database
            await saga.save();
            //console.log(`Saga ${saga.sagaName} saved successfully`);

            // Reset arc index for the next saga
            progress.arcIndex = 0;
            fs.writeFileSync(progressFilePath, JSON.stringify(progress));
        }

        console.log('All data has been processed and saved successfully.');

        console.log('All data has been processed and saved successfully.');
    } catch (err) {
        console.error('An error occurred during the upload process:', err);
    }
});
