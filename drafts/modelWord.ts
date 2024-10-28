const mongoose = require('mongoose');

// Definir el esquema para cada palabra en un idioma
const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,  // La palabra debe ser única
    minlength: 1,
    maxlength: 100  // Longitud mínima y máxima para la palabra
  },
  definition: {
    type: String,
    required: true,
    minlength: 5,  // Definición con un mínimo de 5 caracteres
    maxlength: 1000  // Limita a 1000 caracteres como máximo
  },
  examples: {
    type: [String],  // Lista de ejemplos en ese idioma
    default: [],
    validate: {
      validator: function(arr) {
        return arr.every(example => example.length >= 5);
      },
      message: 'Cada ejemplo debe tener al menos 5 caracteres.'
    }
  },
  type: {
    type: [String],  // Lista filtrada de tipos gramaticales
    enum: [
      'noun', 'verb', 'adjective', 'adverb', 'personal pronoun', 'demonstrative pronoun',
      'possessive pronoun', 'preposition', 'conjunction', 'coordinating conjunction',
      'subordinating conjunction', 'determiner', 'article', 'quantifier', 'interjection',
      'auxiliary verb', 'modal verb', 'infinitive', 'participle', 'gerund', 
      'transitive verb', 'intransitive verb', 'reflexive verb'
    ],
    default: []
  },
  IPA: {
    type: String  // Transcripción fonética, sin validación específica
  },
  seen: {
    type: Number,  // Veces que se ha visto
    default: 0
  },
  img: {
    type: String,  // Imagen opcional
    validate: {
      validator: function(v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i.test(v);
      },
      message: props => `${props.value} no es una URL de imagen válida.`
    }
  },
  level: {
    type: String,  // Nivel de dificultad
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  codeSwitching: {
    type: [String],  // Frases complejas que mezclan ese idioma con español
    validate: {
      validator: function(arr) {
        return arr.every(example => example.includes(this.word) && example.length >= 10);
      },
      message: 'Cada ejemplo de codeSwitching debe incluir la palabra del diccionario y tener al menos 10 caracteres.'
    },
    default: []
  }
}, { timestamps: true });  // timestamps crea automáticamente `createdAt` y `updatedAt`

// Índice para optimizar las búsquedas de palabras
WordSchema.index({ word: 1 });

// Definir el esquema general para el diccionario con múltiples idiomas
const DictionarySchema = new mongoose.Schema({
  languages: {
    type: Map,  // Mapa dinámico para diferentes idiomas
    of: WordSchema  // Cada idioma sigue la estructura de WordSchema
  }
}, { timestamps: true });  // timestamps para la creación y modificación del diccionario

// Exportar el modelo
module.exports = mongoose.model('Dictionary', DictionarySchema);
