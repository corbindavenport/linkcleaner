
// Google Analytics
window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date
ga('create', 'UA-59452245-10', 'auto')
ga('require', 'displayfeatures')
ga('send', 'pageview', '/')

// Detect iOS
// Credit: https://stackoverflow.com/a/9039885
function ifiOS() {
    if (['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform)) {
        return true
    } else if (navigator.userAgent.includes('Mac') && 'ontouchend' in document) {
        // iPadOS detection
        return true
    } else {
        return false
    }
}

// Function for cleaning link
function cleanLink(link) {
    ga('send', {
        hitType: 'event',
        eventCategory: 'Clean link',
        eventAction: 'Clean link',
    })
    var oldLink = new URL(link)
    console.log('Old link:', oldLink)
    var newLink = new URL(oldLink.origin + oldLink.pathname)
    // Retain 'q' parameter
    if (oldLink.searchParams.has('q')) {
        newLink.searchParams.append('q', oldLink.searchParams.get('q'))
    }
    // Fix for YouTube links
    if (oldLink.host.includes('youtube.com') && oldLink.searchParams.has('v')) {
        newLink.searchParams.append('v', oldLink.searchParams.get('v'))
    }
    // Switch to output
    document.getElementById('link-output').value = newLink.toString()
    document.getElementById('initial').style.display = 'none'
    document.getElementById('completed').style.display = 'block'
    // Highlight the output for easy copy
    document.getElementById('link-output').select()
}

// Process URL after a paste action is detected
document.getElementById('link-input').addEventListener('paste', function () {
    // This is wrapped in a timeout or it executes before the value has changed
    setTimeout(function () {
        cleanLink(document.getElementById('link-input').value)
    }, 50)
})

// Paste button
if (typeof navigator.clipboard.readText !== "undefined") {
    document.getElementById('link-paste-btn').addEventListener('click', function () {
        navigator.clipboard.readText().then(function (data) {
            cleanLink(data)
        })
    })
} else {
    document.getElementById('link-paste-btn').disabled = true
}

// Process URL after clicking arrow button
document.getElementById('link-submit').addEventListener('click', function () {
    cleanLink(document.getElementById('link-input').value)
})

// Copy link button
document.getElementById('link-copy-btn').addEventListener('click', function () {
    if (navigator.clipboard) {
        // Use Clipboard API if available
        var copyText = document.getElementById('link-output').value
        navigator.clipboard.writeText(copyText)
    } else {
        // Fallback to older API
        var copyText = document.getElementById('link-output')
        copyText.select()
        document.execCommand('copy')
    }
})

// Start over button
document.getElementById('link-startover').addEventListener('click', function () {
    document.getElementById('completed').style.display = 'none'
    document.getElementById('initial').style.display = 'block'
    document.getElementById('link-input').value = ''
    document.getElementById('link-input').select()
})

// Share button
if (navigator.canShare) {
    document.getElementById('link-share-btn').addEventListener('click', function () {
        try {
            navigator.share({
                url: document.getElementById('link-output').value
            })
        }
        catch (e) {
            alert('There was an error:\n\n' + e.message)
        }
    })
} else {
    document.getElementById('link-share-btn').disabled = true
}

// Button links
document.querySelectorAll('.link-btn').forEach(function (el) {
    el.addEventListener('click', function () {
        window.open(el.getAttribute('data-url'), '_blank')
    })
})

// Show Siri Shortcut prompt on iOS
if (ifiOS()) {
    var alert = document.getElementById('siri-shortcut-alert')
    alert.addEventListener('click', function() {
        window.open('https://www.icloud.com/shortcuts/97048b0d949a4940bd5a4b545c2fcf70', '_blank')
    })
    alert.style.display = 'block'
}

// Web Share Target API and Siri Shortcut support
const parsedUrl = new URL(window.location)
if (parsedUrl.searchParams.get('url')) {
    // This is where the URL SHOULD BE
    cleanLink(parsedUrl.searchParams.get('url'))
} else if (parsedUrl.searchParams.get('text')) {
    // Android usually puts URLs here
    cleanLink(parsedUrl.searchParams.get('text'))
} else if (parsedUrl.searchParams.get('title')) {
    // Android sometimes puts URLs here
    cleanLink(parsedUrl.searchParams.get('title'))
}