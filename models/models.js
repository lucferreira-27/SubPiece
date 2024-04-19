const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  text_empty: Boolean, 
  text: [String],
  id: Number,
  onomatopoeia: Boolean,
});

const CharacterClusterSchema = new mongoose.Schema({
  label: Number,
  members: [Number],  
});

const TextCharacterAssociationSchema = new mongoose.Schema({
  text_id: Number,
  character_id: Number,
  confidence: Number,
});

const AnnotationSchema = new mongoose.Schema({
  image_dimensions: {
    height: Number,
    width: Number,
  },
  image_name: String,
  volume_number: String,
  gemini: [
    {
      gemini_block: Boolean,
      text: [String],
      xyxy: [Number],
      id: Number,
    },
  ],
  panels: [
    {
      bbox: [Number],
    },
  ],
  texts: [
    {
      id: Number,
      bbox: [Number],
    },
  ],
  characters: [String],
  character_clusters: [CharacterClusterSchema],
  text_character_associations: [TextCharacterAssociationSchema],
});


const PageSchema = new mongoose.Schema({
  filename: String,
  annotation: AnnotationSchema,
  transcription: [TextSchema],
  page_number: Number,
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }
});

const ChapterSchema = new mongoose.Schema({
  chapterNumber: Number,
  volumeNumber: Number,
  chapterTitle: String,
  startPage: Number,
  endPage: Number,
  pages: [PageSchema],
});

const ArcSchema = new mongoose.Schema({
  arcName: String,
  startChapter: Number,
  endChapter: Number,
  chapters: [ChapterSchema],
});

const SagaSchema = new mongoose.Schema({
  sagaName: String,
  arcList: [ArcSchema],
});

const Saga = mongoose.model('Saga', SagaSchema);
const Arc = mongoose.model('Arc', ArcSchema);
const Chapter = mongoose.model('Chapter', ChapterSchema);
const Page = mongoose.model('Page', PageSchema);
const Annotation = mongoose.model('Annotation', AnnotationSchema);
const Text = mongoose.model('Text', TextSchema);
const CharacterCluster = mongoose.model('CharacterCluster', CharacterClusterSchema);
const TextCharacterAssociation = mongoose.model('TextCharacterAssociation', TextCharacterAssociationSchema);

module.exports = {
  Saga,
  Arc,
  Chapter,
  Page,
  Annotation,
  Text,
  CharacterCluster,
  TextCharacterAssociation,
};