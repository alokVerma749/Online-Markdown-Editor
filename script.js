// We need to select using query selector or get element by id
// Then add event   listeners to text area
// finally convert  the input to html

const h1 = /^#[^#].*$/gm;
const h2 = /^##[^#].*$/gm;
const bold = /\*\*[^\*\n]+\*\*/gm;
const highlight = /==[^==\n]+==/gm;
const italics = /[^\*]\*[^\*\n]+\*/gm;
const link = /\[[\w|\(|\)|\s|\*|\?|\-|\.|\,]*(\]\(){1}[^\)]*\)/gm;
const lists = /^(\s*(\-|\d\.) [^\n]+)+$/gm
const unorderedList = /^\-\s.*$/
const orderedList = /^\d\.\s.*$/

const textinput = document.querySelector('#textinput')
const markdown_preview = document.querySelector('article')
textinput.addEventListener('input', (e) => {
    let content = e.target.value;
    // h1
    if (h1.test(content)) {
        const matches = content.match(h1)
        matches.forEach((element) => {
            extractedText = element.slice(1)
            content = content.replace(element, `<h1>${extractedText}</h1>`)
        })
        //   h2
        if (h2.test(content)) {
            const matches = content.match(h2)
            matches.forEach((element) => {
                const extractedText = element.slice(2)
                content = content.replace(element, `<h2>${extractedText}</h2>`)
            })
        }
        // bold
        if (bold.test(content)) {
            const matches = content.match(bold)
            matches.forEach((element) => {
                const extractedText = element.slice(2, -2) //sliced from index 2 till the (total length - 2)
                // Example : **abhik** , index 2 is a, so the new string is started from a
                // total length of string is 9  therefore 9 - 2 is 7. So the new string is from index 2 to 7 which is abhik
                content = content.replace(element, `<strong>${extractedText}</strong>`)
            })
        }
        // highlighted
        if (highlight.test(content)) {
            const matches = content.match(highlight)
            matches.forEach((element) => {
                const extractedText = element.slice(2, -2)
                content = content.replace(element,
                    `<span class="highlight">${extractedText}</span>`,
                )
            })
        }
        // italics
        if (italics.test(content)) {
            const matches = content.match(italics)
            matches.forEach((element) => {
                const extractedText = element.slice(2, -1)
                content = content.replace(element, `<em>${extractedText}</em>`)
            })
        }
        // hyperlinks
        if (link.test(content)) {
            const links = content.match(link)
            links.forEach((element) => {
                const text = element.match(/^\[.*\]/)[0].slice(1, -1)
                const url = element.match(/\]\(.*\)/)[0].slice(2, -1)
                content = content.replace(element, `<a href="${url}">${text}</a>`)
            })
        }

        // list conversion
        if (lists.test(content)) {
            const matches = content.match(lists)

            matches.forEach((list) => {
                const listArray = list.split('\n')
                // ['- hi', '- bye', '', '1. hdhd', '2. jdjdj']
                const formattedList = listArray
                    .map((currentValue, index, array) => {
                        if (unorderedList.test(currentValue)) {
                            currentValue = `<li>${currentValue.slice(2)}</li>`

                            if (!unorderedList.test(array[index - 1])) {
                                //array[index-1] will be false if it is null,undefined or < 0
                                // unorderedList.test(array[index - 1]) will return true only if the the array element at index - 1 is ul element
                                // !unorderedList.test(array[index - 1]) will return true if the unorderedList.test(array[index - 1]) returns false
                                currentValue = '<ul>' + currentValue
                                // this means if the previous element of the list element in the array  is not a list element or this list element is the 1st element of the array  then add a starting ul tag
                            }
                            if (!unorderedList.test(array[index + 1])) {
                                //array[index+1] will be false if it is null,undefined or > length of the array
                                // unorderedList.test(array[index + 1]) will return true only if the the array element at index+1 is ul element
                                // !unorderedList.test(array[index + 1]) will return true if the unorderedList.test(array[index + 1]) returns false
                                currentValue = currentValue + '</ul>'
                                // this means if the next element of the list element in the array  is not a list element or this list element is the last element of the array  then append a closing ul tag
                            }
                        }
                        //Similarly create ol
                        if (orderedList.test(currentValue)) {
                            currentValue = `<li>${currentValue.slice(2)}</li>`

                            if (!orderedList.test(array[index - 1])) {
                                currentValue = '<ol>' + currentValue
                            }

                            if (!orderedList.test(array[index + 1])) {
                                currentValue = currentValue + '</ol>'
                            }
                        }

                        return currentValue
                    })
                    .join('')

                content = content.replace(list, formattedList)
            })
        }


        // other lines
        content = content
            .split('\n')
            .map((line) => {
                if (!line.startsWith('<') && line !== '') {
                    return line.replace(line, `<p>${line}</p>`)
                } else {
                    return line
                }
            })
            .join('\n')
    }
    markdown_preview.innerHTML = content
})







