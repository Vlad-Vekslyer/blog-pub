const oneLiners = Object.freeze({
  "header": "##"
})

const multiLiners = Object.freeze({
  "bold": "**",
  "emphasis": "%%"
})

const allTags = Object.freeze([...Object.values(oneLiners), ...Object.values(multiLiners)]);

const allTagsMap = Object.freeze({...oneLiners, ...multiLiners});

export {oneLiners, multiLiners, allTags, allTagsMap}
