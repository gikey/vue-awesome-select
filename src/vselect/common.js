import _ from 'lodash'

Array.prototype.pushUnique = function (data) {
    typeof data == 'object' ? (!_.find(this, data) && this.push(data)) : (!~this.indexOf(data) && this.push(data))
    return [...this]
}

Array.prototype.pushUniqueByArray = function (data) {
    data.forEach(item => {
        this.pushUnique(item)
    })
    return [...this]
}

Array.prototype.unique = function () {
    let newArr = /\[object Object\]/i.test(this.toString()) ? _.uniqWith(this, _.isEqual) : _.uniq(this)
    this.splice(0, this.length)
    this.push(...newArr)
    return [...this]
}

Array.prototype.removeByIndex = function (index) {
    this.splice(index, 1)
    return [...this]
}

Array.prototype.remove = function (data) {
    if (typeof data == 'object') {
        _.remove(this, item => {
            return _.isEqual(item, data)
        })
    } else {
        _.pull(this, data)
    }
    return [...this]
}

Array.prototype.toggle = function (data) {
    if (typeof data == 'object') {
        if (!_.find(this, data)) {
            this.push(data)
        } else {
            _.remove(this, item => {
                return _.isEqual(item, data)
            })
        }
    } else {
        if (!~this.indexOf(data)) {
            this.push(data)
        } else {
            _.pull(this, data)
        }
    }
    return [...this]
}