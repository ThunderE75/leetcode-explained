const VIDEO_ASPECT_RATIO = 56.25; // 16:9 aspect ratio
const SOLUTIONS_TAB_INDEX = 0;

function createStyledElement(tagName: string, styles: { [key: string]: string }) {
    const element = document.createElement(tagName);
    for (const [key, value] of Object.entries(styles)) {
        if (typeof element.style[key as any] !== 'undefined') {
            (element.style as any)[key] = value;
        }
    }
    return element;
}

function createStyledButton(text: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.border = '1px solid grey';
    button.style.backgroundColor = '#222';
    button.style.width = '100px';
    button.style.padding = '3px';
    button.style.margin = '0px 20px';
    button.style.borderRadius = '5px';
    button.style.fontSize = '12px';
    // on button hover, change background color
    button.addEventListener('mouseover', () => {
        button.style.color = 'lightgreen';
        button.style.border = '1px solid lightgreen';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#222';
        button.style.color = 'white';
        button.style.border = '1px solid grey';
    });
    return button;
}

function createVideoContainer(problem: any) {
    const container = createStyledElement('div', {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: `${VIDEO_ASPECT_RATIO}%`,
        marginBottom: '60px',
        transition: 'padding-bottom 0.3s ease-out',
    });
    container.classList.add('video-container');

    const iframe = createStyledElement('iframe', {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        width: '95%',
        height: '95%',
        border: '1px solid grey',
        paddingBottom: '20px',
        marginTop: '50px',
    }) as HTMLIFrameElement;

    iframe.classList.add('youtube-video');
    let src = problem.videos[0].embedded_url;
    iframe.src = src;
    iframe.allowFullscreen = true;

    const controlsContainer = createStyledElement('div', {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        paddingTop: '10px',
        marginBottom: '50px',
        boxSizing: 'border-box',
        color: '#fff',
    });

    const prevButton = document.createElement('button');
    prevButton.textContent = '⬅️';
    prevButton.style.fontSize = '20px';
    const nextButton = document.createElement('button');
    nextButton.textContent = '➡️';
    nextButton.style.fontSize = '20px';

    const channelElement = createStyledElement('div', {
        fontSize: '12px',
        textAlign: 'center',
        width: '200px',
    });
    let currentVideoIndex = 0;
    channelElement.classList.add('channel');
    channelElement.textContent = problem.videos[currentVideoIndex].channel;;
    channelElement.style.fontWeight = '400';
    channelElement.style.color = 'lightcyan';
    channelElement.style.textShadow = '0 0 5px #000000';
    channelElement.style.fontFamily = 'Menlo, Monaco, Consolas, "Courier New", monospace';

    prevButton.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex - 1 + problem.videos.length) % problem.videos.length;
        updateVideo(iframe, problem.videos[currentVideoIndex].embedded_url);
        channelElement.textContent = problem.videos[currentVideoIndex].channel; // Update channel name
    });

    nextButton.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex + 1) % problem.videos.length;
        updateVideo(iframe, problem.videos[currentVideoIndex].embedded_url);
        channelElement.textContent = problem.videos[currentVideoIndex].channel; // Update channel name
    });

    controlsContainer.append(prevButton, channelElement, nextButton);
    container.append(controlsContainer);
    container.append(iframe);

    return container;
}

function updateVideo(iframe: HTMLIFrameElement, videoUrl: string) {
    iframe.src = videoUrl;
}

function createCodeContainer() {
    // Create an HTML element to hold the code
    const codeElement = document.createElement('pre');
    codeElement.classList.add('code-container');
    codeElement.style.display = 'none';
    codeElement.style.border = '1px solid grey';
    codeElement.style.paddingLeft = '5px';
    codeElement.style.marginTop = '20px';
    codeElement.style.width = '95%';
    codeElement.style.fontSize = '12px';
    codeElement.style.marginLeft = '2.5%';
    codeElement.style.padding = '10px';
    codeElement.style.height = '100%';
    return codeElement;
}

function hideContent() {
    let codeContainer = document.getElementsByClassName('code-container')[0] as HTMLDivElement;
    if (codeContainer) codeContainer.style.display = 'none';
    let languageButtonsContainer = document.getElementsByClassName('language-buttons-container')[0] as HTMLDivElement;
    if (languageButtonsContainer) languageButtonsContainer.style.display = 'none';

    let navContainer = document.getElementsByClassName('nav-container')[0] as HTMLDivElement;
    navContainer.style.display = 'flex';

    let videoContainer = document.querySelector('div.video-container') as HTMLDivElement;
    videoContainer.style.paddingBottom = '0%';
    videoContainer.style.display = 'none';
}

function createNavContainer() {
    const controlsContainer = createStyledElement('div', {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: '10px',
        paddingBottom: '20px',
        boxSizing: 'border-box',
        color: '#fff',
    });

    controlsContainer.classList.add('nav-container');

    // Create the buttons using the utility function
    const discussionButton = createStyledButton('Discussion');
    const videoButton = createStyledButton('Video');
    const codeButton = createStyledButton('Code');

    discussionButton.addEventListener('click', () => {
        hideContent();
    });

    videoButton.addEventListener('click', () => {
        hideContent();
        let videoContainer = document.querySelector('div.video-container') as HTMLDivElement;
        videoContainer.style.paddingBottom = `${VIDEO_ASPECT_RATIO}%`;
        videoContainer.style.display = 'flex';
    });

    codeButton.addEventListener('click', () => {
        hideContent();
        let videoContainer = document.querySelector('div.video-container') as HTMLDivElement;
        videoContainer.style.paddingBottom = '0%';
        let codeContainer = document.getElementsByClassName('code-container')[0] as HTMLDivElement;
        codeContainer.style.display = 'flex';

        let languageButtonsContainer = document.getElementsByClassName('language-buttons-container')[0] as HTMLDivElement;
        languageButtonsContainer.classList.add('language-buttons-container');
        languageButtonsContainer.style.display = 'flex';
    });

    controlsContainer.append(videoButton, codeButton, discussionButton);
    return controlsContainer;
}

// Convert problem title to GitHub-compatible string
function titleToGitHubFormat(title: string, frontend_id: number): string {
    const formattedTitle = title.toLowerCase().replace(/ /g, "-");
    const idStr = frontend_id.toString().padStart(4, '0');
    return `${idStr}-${formattedTitle}`;
}

// Function to fetch the code from GitHub and insert it into the solutions tab
async function getCodeSolution(title: string, frontend_id: number, language: string,) {

    // map the language names to their extensions
    const languageMap = {
        'python': 'py',
        'java': 'java',
        'javascript': 'js',
        'cpp': 'cpp',
    }

    // Convert frontend_id and title to the GitHub-compatible format
    const formattedTitle = titleToGitHubFormat(title, frontend_id);
    const filePath = `${language}/${formattedTitle}.${languageMap[language]}`; // Change 'other_extension' accordingly

    // Construct the URL to fetch the file content from GitHub
    const url = `https://api.github.com/repos/neetcode-gh/leetcode/contents/${filePath}`;

    try {
        // Make the API call to fetch the code from GitHub
        const response = await fetch(url);
        const data = await response.json();

        // Decode the Base64 encoded content
        const code = atob(data.content);
        return code;
    } catch (error) {
        console.error('Failed to fetch code:', error);
    }
}

function createLanguageButtons(problem: any) {
    const container = createStyledElement('div', {
        paddingTop: '20px',
        marginLeft: '20px',
    });

    // For each language, create a button and set up its event listener
    problem.languages.forEach((language: string) => {
        // Create the button using the utility function
        const buttonLabel = (language === "cpp") ? "C++" : (language.charAt(0).toUpperCase() + language.slice(1));
        const langButton = document.createElement('button');
        langButton.style.border = '1px solid grey';
        langButton.style.width = '110px';
        langButton.style.display = 'flex';
        langButton.style.flexDirection = 'row';
        langButton.style.padding = '3px';
        langButton.style.margin = '0px 5px';
        langButton.addEventListener('mouseover', () => {
            langButton.style.borderColor = 'lightgreen';
        });
        langButton.addEventListener('mouseout', () => {
            langButton.style.borderColor = 'grey';
        });

        // Get the icon for the language
        const langIcon = document.createElement('img');
        langIcon.src = chrome.runtime.getURL(`src/assets/images/languages/${language}.svg`);
        langIcon.style.width = '20px';
        langIcon.style.height = '20px';

        langButton.appendChild(langIcon);
        let langName = document.createElement('span');
        langName.textContent = buttonLabel;
        langName.style.fontSize = '12px';
        langName.style.paddingLeft = '15px';
        langButton.appendChild(langName);

        langButton.addEventListener('click', () => {
            let code = getCodeSolution(problem.title, problem.frontend_id, language);
            code.then((code) => {
                let codeContainer = document.getElementsByClassName('code-container')[0] as HTMLDivElement;
                if (codeContainer) {
                    codeContainer.style.display = 'flex';
                    codeContainer.textContent = code;
                    addCopyIconToElement(codeContainer);
                }
            });
        });
        container.append(langButton);
    });
    return container;
}


function addCopyIconToElement(element: HTMLElement) {
    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL("src/assets/images/copy-icon.png");
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.padding = '5px';
    icon.style.borderRadius = '5px';
    icon.style.border = '1px solid grey';
    icon.style.cursor = 'pointer';
    icon.style.marginRight = '20px';
    // on hover, change background color
    icon.addEventListener('mouseover', () => {
        icon.style.borderColor = 'lightgreen';
    });
    icon.addEventListener('mouseout', () => {
        icon.style.borderColor = 'grey';
    });

    // On click event if you want to copy something when the icon is clicked
    icon.addEventListener('click', () => {
        // Logic to copy whatever you want to clipboard
        let codeContainer = document.getElementsByClassName('code-container')[0] as HTMLDivElement;
        const textToCopy = codeContainer.textContent || "";
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Change the icon to a checkmark to indicate that the text has been copied
            icon.src = chrome.runtime.getURL("src/assets/images/check-icon.png");
            // After 2 seconds, change the icon back to the copy icon
            setTimeout(() => {
                icon.src = chrome.runtime.getURL("src/assets/images/copy-icon.png");
            }, 1000);
        }).catch(err => {
            console.error("Could not copy text: ", err);
        });
    });

    element.insertBefore(icon, element.firstChild);
}


chrome.runtime.onMessage.addListener((request) => {
    // get discussion tab so we can insert the content before it

    if (request.action === 'updateSolutions') {
    const searchBar = document.querySelectorAll('div.flex.items-center.justify-between')[1].parentElement;
        console.log('update solutions requested');

        const title = request.title.split('-')[0].trim();
        chrome.storage.local.get(['leetcodeProblems'], (result) => {
            const problem = result.leetcodeProblems.questions.find((problem: { title: string }) => problem.title === title);

            // Check if the nav container already exists before adding
            if (!document.querySelector('.nav-container')) {
                let navContainer = createNavContainer(); 
                searchBar?.insertBefore(navContainer, searchBar.firstChild)
            }

            // Check if the video container already exists before adding
            if (!document.querySelector('.video-container')) {
                let videoContainer = createVideoContainer(problem);
                if (searchBar) searchBar.insertBefore(videoContainer, searchBar.children[1]);
            }

            // Check if the code container already exists before adding
            if (!document.querySelector('.code-container')) {
                let codeContainer = createCodeContainer();
                if (searchBar) searchBar.insertBefore(codeContainer, searchBar.children[1]);
                let code = getCodeSolution(problem.title, problem.frontend_id, 'python');
                code.then((code) => {
                    let codeContainer = document.getElementsByClassName('code-container')[0] as HTMLDivElement;
                    if (codeContainer) {
                        codeContainer.textContent = code;
                        addCopyIconToElement(codeContainer);
                    }
                });
            }

            // Check if the language buttons container already exists before adding
            if (!document.querySelector('.language-buttons-container')) {
                let languageButtonsContainer = createLanguageButtons(problem);
                languageButtonsContainer.classList.add('language-buttons-container');
                languageButtonsContainer.style.display = 'none';
                if (searchBar) searchBar.insertBefore(languageButtonsContainer, searchBar.children[1]);  // Or choose a different position
            }
        });
    }
});


