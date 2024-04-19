// Assuming sagaList is loaded from sagas_names.json

const fs = require('fs');
const path = require('path');
const {extractPageNumber} = require('./utils')

const {sagaList} = JSON.parse(fs.readFileSync('./sagas_names.json'));

// Assuming content_volumes is an array or object from which you can get chapter details

function findLastPageBetweenChapters(chapters, startPage) {
    let endPage = null;
    for (let i = 0; i < chapters.length; i++) {
        if (chapters[i].startPage === startPage) {
            // If it's the last chapter, there's no next chapter to determine the endPage from
            if (i === chapters.length - 1) {
                break;
            } else {
                // endPage is one less than the startPage of the next chapter
                endPage = chapters[i + 1].startPage - 1;
            }
            break;
        }
    }
    return endPage;
}

function getPages(volumeNumber, startPage, endPage) {
    const volumePath = path.join('./extracted_volumes', `One Piece v${volumeNumber}.json`);
    const volumeContents = JSON.parse(fs.readFileSync(volumePath, 'utf8'));
    const pages = [];
    let currentPage = 0;
    for(const page of volumeContents.pages) {
        // parse "filename": "One Piece v1-005.jpg", to number
        const extractPages = extractPageNumber(page.filename);
        currentPage = extractPages[extractPages.length - 1].page_number;
        if(currentPage >= startPage && (currentPage <= endPage || endPage === null)) {
            pages.push({
                filename: page.filename,
                annotation: page.annotation,
                transcription: page.transcription,
                page_number: currentPage
            });
        }
    }
    if(endPage === null) {
        endPage = currentPage
    }
    return {pages, endPage};
}

function getChapterDetails(chapterNumber) {
    let volumeNumber = 1; // Start from volume 1
    let chapterTitle = `Chapter ${chapterNumber} - Not Found`; // Default title if not found
    let chapterDetails = {}

    while (true) {
        try {
            const volumePath = path.join('./content_volumes', `content_volume_${volumeNumber}.json`);
            const volumeContents = JSON.parse(fs.readFileSync(volumePath, 'utf8'));
            const chapter = volumeContents.contents.find(chapter => chapter.chapterNumber === chapterNumber);
            if (chapter) {
                chapterTitle = chapter.chapterTitle;
                startPage = chapter.startPage;
                const endPage = findLastPageBetweenChapters(volumeContents.contents, chapter.startPage);
                const pagesDetails = getPages(volumeNumber, startPage, endPage);
                
                chapterDetails = {
                    volumeNumber,
                    chapterTitle, 
                    startPage, 
                    endPage: endPage == null ? pagesDetails.endPage : endPage,
                    pages: pagesDetails.pages 
                };
                break
            }
            volumeNumber++; // Move to the next volume
        } catch (error) {
            // Assuming error is due to file not existing. Exit loop if volume file not found.
            console.log(`Volume ${volumeNumber} not found or error reading volume.`, error);
            break;
        }
    }

    return chapterDetails;
}

// Function to enrich sagaList with chapter details
function enrichSagaListWithChapters(sagaList) {
    sagaList.forEach(saga => {
        saga.arcList.forEach(arc => {
            arc.chapters = [];
            for (let chapterNumber = arc.startChapter; chapterNumber <= arc.endChapter; chapterNumber++) {
                const chapterDetails = getChapterDetails(chapterNumber);
                arc.chapters.push({
                    chapterNumber, 
                    ...chapterDetails
                });
            }
        });
    });
}

// Run the function to enrich sagaList
enrichSagaListWithChapters(sagaList);

// sagaList now contains the enriched chapter details
console.log(sagaList);
fs.writeFileSync('./sagas_names_with_chapters.json', JSON.stringify(sagaList, null, 2));

