const express = require('express');
const router = express.Router();
const { Saga, Arc, Chapter, Page } = require('./models/models');

// Get all sagas with pagination
router.get('/sagas', async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    try {
        const sagas = await Saga.find()
            .select('sagaName arcList.arcName arcList.startChapter arcList.endChapter arcList._id') // Include only sagaName and arcList._id fields
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const count = await Saga.countDocuments();
        res.json({
            sagas,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
    console.log("Please");
        res.status(500).json({ message: err.message });
    }
});

// Get a specific saga by ID
router.get('/sagas/:id', async (req, res) => {
    try {
        const saga = await Saga.findById(req.params.id);
        res.json(saga);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all arcs for a specific saga with pagination
// Get all arcs for a specific saga with pagination
router.get('/sagas/:sagaId/arcs', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const saga = await Saga.findById(req.params.sagaId)
            .select('arcList.arcName arcList.startChapter arcList.endChapter') // Include only essential arc fields
            .exec();
        const arcs = saga.arcList.slice((page - 1) * limit, page * limit);
        res.json({
            arcs,
            totalPages: Math.ceil(saga.arcList.length / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific arc by ID
router.get('/arcs/:id', async (req, res) => {
    try {
        const arc = await Arc.findById(req.params.id);
        res.json(arc);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all chapters for a specific arc with pagination
router.get('/arcs/:arcId/chapters', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const arc = await Arc.findById(req.params.arcId)
        .select('chapters.chapterNumber chapters.chapterTitle chapters.startPage chapters.endPage chapters._id');
        const chapters = arc.chapters.slice((page - 1) * limit, page * limit);
        res.json({
            chapters,
            totalPages: Math.ceil(arc.chapters.length / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific chapter by ID
router.get('/chapters/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id)
        .select('chapterNumber chapterTitle startPage endPage');
        res.json(chapter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all pages for a specific chapter with pagination
router.get('/chapters/:chapterId/pages', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const chapter = await Chapter.findById(req.params.chapterId)
        
        const pages = chapter.pages.slice((page - 1) * limit, page * limit);
        res.json({
            pages,
            totalPages: Math.ceil(chapter.pages.length / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific page by ID
router.get('/pages/:id', async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search for transcription in pages
router.get('/search', async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;
    try {
      const chapters = await Chapter.find(
        {
          'pages.transcription.text': { $regex: query, $options: 'i' }
        },
        {
          _id: 1,
          chapterNumber: 1,
          chapterTitle: 1,
          startPage: 1,
          pages: {
            $elemMatch: {
              'transcription.text': { $regex: query, $options: 'i' }
            }
          }
        }
      )
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
  
      const groupedTranscriptions = chapters.reduce((acc, chapter) => {
        const chapterId = chapter._id.toString();
  
        acc[chapterId] = {
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.chapterTitle,
          pages: chapter.pages.reduce((pageAcc, page) => {
            const pageId = page._id.toString();
            const chapterPageNumber = page.page_number - chapter.startPage + 1;
  
            pageAcc[pageId] = {
              pageId: page._id,
              filename: page.filename,
              pageNumber: chapterPageNumber,
              transcriptions: page.transcription.filter(t =>
                t.text.some(text => text.match(new RegExp(query, 'i')))
              )
            };
  
            return pageAcc;
          }, {})
        };
  
        return acc;
      }, {});
  
      const count = await Chapter.countDocuments({
        'pages.transcription.text': { $regex: query, $options: 'i' }
      });
  
      res.json({
        transcriptions: Object.values(groupedTranscriptions),
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
module.exports = router;