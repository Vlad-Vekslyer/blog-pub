const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

class Sentence {
  constructor() {
    this.encoder = use.load();
  }

  async compare(str1, str2) {
    try {
      const encoder = await this.encoder;
      const embedding = await encoder.embed([str1, str2]);
      const score1 = embedding.slice([0,0], [1]);
      const score2 = embedding.slice([1,0], [1]);
      return tf.matMul(score1, score2, false, true).dataSync();
    } catch(e){
      throw e;
    }
  }
}

module.exports = Sentence;

// use.load().then(model => {
//   const sentences = [
//   'Breaking news', 'Iran has retaliated against the US', 'Syria chooses to remain uninvolved'
//   ];
//   model.embed(sentences).then(embeddings => {
//     sentences.forEach((val, i) => {
//       sentences.forEach((val2, j) => {
//         console.log("val1: " + val);
//         console.log("val2: " + val2);
//         const sentenceI = embeddings.slice([i, 0], [1]);
//         const sentenceJ = embeddings.slice([j, 0], [1]);
//         const score = tf.matMul(sentenceI, sentenceJ, false, true).dataSync();
//         console.log(score);
//       })
//     })
//   })
// })
