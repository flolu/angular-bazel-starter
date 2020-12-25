import * as fs from 'fs'
import * as path from 'path'
import * as nodeHtmlParser from 'node-html-parser'
import * as htmlMinifier from 'html-minifier'

const ruleDir = process.argv[2]
const htmlPath = process.argv[3]
const cssPath = process.argv[4]

console.log({ruleDir, htmlPath, cssPath})

async function main() {
  const html = await fs.promises.readFile(htmlPath)
  const root = nodeHtmlParser.parse(html.toString())
  const body = root.querySelector('body')
  const head = root.querySelector('head')

  const stamp = 'TODO'
  const stylesPath = path.relative(cssPath, ruleDir)
  const styles = nodeHtmlParser.parse(`<link rel="stylesheet" href="${stylesPath}?v=${stamp}">`)
  head.appendChild(styles)
  // const div = nodeHtmlParser.parse('<div>generated</div>')
  // body.appendChild(div)
  const rawHtml = root.toString()
  const minifiedHtml = htmlMinifier.minify(rawHtml, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeTagWhitespace: true,
    minifyCSS: true,
  })

  // await fs.promises.writeFile(path.join(ruleDir, 'generated.index.html'), minifiedHtml)
  await fs.promises.writeFile(path.join(ruleDir, 'generated.index.html'), rawHtml)
}

main()
