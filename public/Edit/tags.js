const oneLiners = {
  "header": "##"
}

const multiLiners = {
  "bold": "**",
  "emphasis": "%%"
}

const allTags = ["##, **, %%"];

const allTagsMap = {...oneLiners, ...multiLiners}

export {oneLiners, multiLiners, allTags, allTagsMap}
