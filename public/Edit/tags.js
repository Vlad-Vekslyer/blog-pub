const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

const allTags = [...Object.values(oneLiners), ...Object.values(multiLiners)];

const allTagsMap = {...oneLiners, ...multiLiners}

export {oneLiners, multiLiners, allTags, allTagsMap}
