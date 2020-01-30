const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

class Sentence {
  constructor() {
    this.encoder = use.load();
    this.lr = 0.5;
  }

  // @currentS is an array of the sentences from the latest contribution
  // @incomingS is an array of the sentences from the incoming contribution
  // @return a 2D array of scores between 0 and 1 that represent how close each incoming sentence is to each current sentence
  async compare(currentS, incomingS) {
    try {
      const encoder = await this.encoder;
      const currentEmb = await encoder.embed(currentS);
      const incomingEmb = await encoder.embed(incomingS);
      const scores = currentS.map((s1, currentIndex) => {
        return Promise.all(incomingS.map((s2, incomingIndex) => {
          const currentSent = tf.slice(currentEmb, [currentIndex, 0], [1]);
          const incomingSent = tf.slice(incomingEmb, [incomingIndex, 0], [1]);
          return tf.matMul(currentSent, incomingSent, false, true).data();
        }))
      });
      return Promise.all(scores);
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
