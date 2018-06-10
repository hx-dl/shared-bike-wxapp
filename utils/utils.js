class utils {
  judgeNull(value) {
    if (value == null || value == undefined) return true
    if (this.judgeString(value)) {
      if (value.trim().length == 0) return true
    } else if (this.judgeArray(value)) {
      if (value.length == 0) return true
    } else if (this.judgeObject(value)) {
      for (let name in value) return false
      return true
    }
    return false;
  }
  judgeString(value) {
    return value != null && value != undefined && value.constructor == String
  }
  judgeNumber(value) {
    return value != null && value != undefined && value.constructor == Number
  }
  judgeBoolean(value) {
    return value != null && value != undefined && value.constructor == Boolean
  }
  judgeArray(value) {
    return value != null && value != undefined && value.constructor == Array
  }
  judgeObject(value) {
    return value != null && value != undefined && value.constructor == Object
  }
  judgeFunction(value) {
    return value != null && value != undefined && value.constructor == Function
  }
  mergeObject() {
    let newObject = {}
    for (let a = 0; a < arguments.length; a++) {
      let mergeObject = arguments[a]
      for (let prototype in mergeObject) {
        let mergeObjectPrototype = mergeObject[prototype]
        if (this.judgeObject(mergeObjectPrototype)) {
          newObject[prototype] = this.mergeObject({}, mergeObjectPrototype)
        } else if (this.judgeArray(mergeObjectPrototype) && this.judgeObject(mergeObjectPrototype[0])) {
          let newArray = []
          for (let b = 0; b < mergeObjectPrototype.length; b++) {
            newArray.push(this.mergeObject({}, mergeObjectPrototype[a]))
          }
          newObject[prototype] = newArray
        } else {
          newObject[prototype] = mergeObjectPrototype
        }
      }
    }
    return newObject
  }
  getApp() {
    return getApp()
  }
  getCurrentPages() {
    return getCurrentPages()
  }
  getCurrentPage() {
    let pages = this.getCurrentPages()
    return pages[pages.length - 1]
  }
  getCurrentPath() {
    return this.getCurrentPage().__route__
  }
  getPath(targetPath) {
    let currentPath = this.getCurrentPath()
    return this.getRelativePath(currentPath, targetPath)
  }
  getRelativePath(currentPath, targetPath) {
    let currentPathArray = currentPath.split('/')
    let targetPathArray = targetPath.split('/')
    let samePath = false
    let levelNumber = 0
    let relativePath = ''
    for (let a = 0; a < currentPathArray.length; a++) {
      let currentPathData = currentPathArray[a]
      for (let b = 0; b < targetPathArray.length; b++) {
        let targetPathData = targetPathArray[b]
        if (targetPathData == currentPathData) {
          levelNumber = currentPathArray.length - b - 1
          samePath = true
          break
        }
      }
    }
    if (samePath) {
      for (let a = 0; a < levelNumber - 1; a++) {
        relativePath += '../'
      }
      for (let a = levelNumber; a > 0; a--) {
        let targetPathData = targetPathArray[a]
        if (a == 1) relativePath += targetPathData
        else relativePath += targetPathData + '/'
      }
    } else {
      levelNumber = currentPathArray.length - 1
      for (let a = 0; a < levelNumber; a++) {
        relativePath += '../'
      }
      for (let a = 0; a < targetPathArray.length; a++) {
        let targetPathData = targetPathArray[a]
        if (a == targetPathArray.length - 1) relativePath += targetPathData
        else relativePath += targetPathData + '/'
      }
    }
    return relativePath
  }
  getTimestamp() {
    return Date.parse(new Date())
  }
  getClassName(params) {
    if (this.judgeNull(params)) return ''
    if (!this.judgeObject(params)) {
      console.error('expect object params')
      return ''
    }
    let className = ''
    for (var name in params) {
      if (params[name]) className += ' ' + name
    }
    return className.replace(/ /, '')
  }
}

export default utils