function extractPageNumber(image) {

    const toNumber = (str) => {
        const onlyNumbers = str.replace(/\D/g, '');
        return parseInt(onlyNumbers, 10);
    };
    const originalImage = image;
    image = image.toLowerCase();
    // Retain the original patterns for single and range of pages
    const pattern = /p(\d+)(?:-p(\d+))?/;
    // Pattern to capture page numbers formatted as "-00x" or "-0xx" or "-xxx"
    const extendedPattern = /-0*(\d+)(?:-0*(\d+))?/;
    // New pattern to match more nested name files like "One Piece v88 - c880 - 001 [Digital HD] [aKraa]"
    const nestedPattern = /(?:c\d+\s+-\s+)(\d+)(?:-(\d+))?(?=\s+\[)/;
  
    // Find matches for all patterns
    const matches = image.match(pattern) || [];
    const extendedMatches = image.match(extendedPattern) || [];
    const nestedMatches = image.match(nestedPattern) || [];
  
    // Combine matches from all patterns
    const allMatches = [...matches, ...extendedMatches, ...nestedMatches];
  
    const pageObjs = [];
    if (allMatches.length > 0) {
      for (const match of allMatches) {
        if (allMatches[2] && allMatches[3]) {
          // If there's a range of pages or a nested match
          const startPage = toNumber(allMatches[2]);
          const endPage = toNumber( allMatches[3]);
          for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const pageObj = { page_number: pageNum, image_name: originalImage };
            if (!pageObjs.some((obj) => obj.page_number === pageObj.page_number)) {
              // Check if page already added
              pageObjs.push(pageObj);
            }
          }
        } else {
          // Single page number
          const singlePageObj = { page_number: toNumber(match), image_name: originalImage };
          if (!pageObjs.some((obj) => obj.page_number === singlePageObj.page_number)) {
            // Check if page already added
            pageObjs.push(singlePageObj);
            break
          }
        }
      }
    }
    return pageObjs.length > 0 ? pageObjs : null;
  }

module.exports = {
    extractPageNumber
}

