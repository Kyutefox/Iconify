//Constants
const LOADING_ICON  =   $(document).find("#iconify-svg-icon").html();
const USER          =   {logged_in : false, id : 0, premium_token : null, active_on : null};
let clonedCopySVG = null;

// Stylesheet for loading icon and snackbar
const snackbarStyle         =   `.snackbar-container{transition:top .5s,right .5s,bottom .5s,left .5s,opacity .5s;font-family:Roboto,sans-serif;font-size:14px;min-height:14px;background-color:#070b0e;position:fixed;display:flex;justify-content:space-between;align-items:center;color:#fff;line-height:22px;padding:18px 24px;bottom:-100px;top:-100px;opacity:0;z-index:9999}.snackbar-container .action{background:inherit;display:inline-block;border:none;font-size:inherit;text-transform:uppercase;color:#4caf50;margin:0 0 0 24px;padding:0;min-width:min-content;cursor:pointer}@media (min-width:640px){.snackbar-container{min-width:288px;max-width:568px;display:inline-flex;border-radius:2px;margin:24px}}.snackbar-pos.bottom-center{top:auto!important;bottom:0;left:50%;transform:translate(-50%,0)}.snackbar-pos.bottom-left{top:auto!important;bottom:0;left:0}.snackbar-pos.bottom-right{top:auto!important;bottom:0;right:0}.snackbar-pos.top-left{bottom:auto!important;top:0;left:0}.snackbar-pos.top-center{bottom:auto!important;top:0;left:50%;transform:translate(-50%,0)}.snackbar-pos.top-right{bottom:auto!important;top:0;right:0}@media (max-width:640px){.snackbar-container{left:0;right:0;width:100%}.snackbar-pos.bottom-center,.snackbar-pos.top-center{left:0;transform:none}}`;
const bounceCss             =   `@keyframes rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}.iconify-icon{animation:2s linear infinite rotate}`
// Create snackbar and Loading Icon
const styleElement = document.createElement("style");
styleElement.textContent = snackbarStyle + bounceCss;
document.head.appendChild(styleElement);

const initButtonFae = () => {
    // Create the button element
   const button = $('<span>', {
        id: 'getFontawesomeCdn',
        class: "position-relative",
        text: 'Generate Premium Icon CDN Link',
        click: function() {
            let versionSelector = $(document).find("#choose_aversionoffontawesome").val() ?? "6.4.2";
            let link = `https://site-assets.fontawesome.com/releases/v${versionSelector}/css/all.css`
            const textToCopy = link;
            const tempInput = $('<input>');
            $(document).find("body").append(tempInput);
            tempInput.val(textToCopy).select();
            document.execCommand('copy');
            tempInput.remove();
            Snackbar.show({ text : "CDN link copied to clipboard" , showAction : false})
        }
    });

    // Set the button's position and styles
    button.css({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '999',
        padding: "10px 20px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        borderRadius: "4px", /* Added border radius */
    });


    // Append the button to the container
    var container = $('body');
    container.append(button);
}

const initFontAwesome = () => {
    let button = $(document).find("#fontAwesomeSVGDownload");
    if(button.length < 1){
        $(document).find(".icon-actions").append("<button class='position-relative' id='fontAwesomeSVGDownload' style='top: calc(0.375em) * -1) !important;width: 100% !important;'>Download SVG</button>");
    }
}

// Create download
const downloadIcon = function (text = "", downloadAbleName = "", extension = "svg")
{
    let newAnchorElement = document.createElement("a");
    newAnchorElement.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    newAnchorElement.setAttribute("download", (downloadAbleName + `.${extension}`) ?? "iconify.svg");
    newAnchorElement.style.display = "none";
    document.body.appendChild(newAnchorElement);
    newAnchorElement.click();
    document.body.removeChild(newAnchorElement);
}

// Create  download json
const downloadJson = function (data = {}, downloadAbleName = "", extension = "json"){
    let jsonString = JSON.stringify(data, null, 2);
    let blob = new Blob([jsonString], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.href = url;
    link.download = (downloadAbleName + "." + extension) ?? "iconify.json";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
}

//Copy SVG to clipboard
const copyToClipBoard = function (text, clickedButtonElement, replacer)
{
    const tempTextarea = $('<textarea>');
    tempTextarea.val(text);
    $('body').append(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    tempTextarea.remove();
    Snackbar.show({ text : "SVG Copied to clipboard." });
    clickedButtonElement.html(replacer);
}

// Check user logged in state
const checkLoggedInStatus = function ()
{
    return USER.hasOwnProperty("logged_in") && USER.logged_in === true;
}

// Activate the download buttons
const activateButtons = function ()
{
    let iconifyPremiumElements = $("#fi-premium-download-buttons");
    iconifyPremiumElements.find(".icon--premium").hide();
    iconifyPremiumElements.find(".modal-body .hr:first").prevUntil("p.font-md.bold").remove();

    $("section[class='profile']").find("div[class='alert alert-warning']").remove();
}

// load content
window.addEventListener("load", function (){
    // Observer to observe the content changes on page.
    let targetNode  =   document.body;
    let observer    =   new MutationObserver(function (mutations)
    {
        mutations.forEach(function (mutation) {
            activateButtons();
        });

        // flaticon
        if($(document).find("#gr_user_menu_avatar").length > 0)
        {
            let userAccount = $(document).find("#gr_user_menu_avatar").find("img").attr("alt");
            userAccount     = userAccount.replace(/^user/, "");
            USER.logged_in  = true;
            USER.id         = userAccount;
            USER.active_on  = "flaticon";
        }

        // icon8
        if($(document).find(".i8-header__login").find(".username").length > 0)
        {
            let userAccount = $(document).find(".i8-header__login").find(".username").html();
            USER.logged_in  = true;
            USER.id         = userAccount;
            USER.active_on  = "icons8";
        }

        // iconscout
        if($(document).find(".userProfile_UGnys h3").length > 0)
        {
            let userAccount = $(document).find(".userProfile_UGnys h3").text();
            USER.logged_in  = true;
            USER.id         = userAccount;
            USER.active_on  = "iconscout";
        }

        // Replace the download button with SVG download button in Iconscout
        let iconScoutPremiumDownloadButton = $("<button class='download-icon btn btn-lg btn-primary btn-block'>").text("Download").removeAttr("href");
        $("a[href='/pricing'][class='btn btn-lg btn-primary btn-block']").replaceWith(iconScoutPremiumDownloadButton);
    });

    // Options for the observer (which mutations to observe)
    let config = { attributes: true, childList: true, subtree: true };
    observer.observe(targetNode, config);

    // Add download SVG button in Icons8 modal after clicking the original available download button
    let icons8DownloadButton = '<center><button style="margin-bottom: 25px;width: 93%;" class="download-svg-ry i8-button--primary i8-button--large i8-button"><div data-v-969e794c="" class="dim__primary-btn-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1C9 0.447715 9.44771 0 10 0C10.5523 0 11 0.447715 11 1V11.0703L14.8632 7.20711C15.2537 6.81658 15.8869 6.81658 16.2774 7.20711L16.3632 7.29289C16.7537 7.68342 16.7537 8.31658 16.3632 8.70711L10 15.0703L3.63679 8.70711C3.24627 8.31658 3.24627 7.68342 3.63679 7.29289L3.72258 7.20711C4.11311 6.81658 4.74627 6.81658 5.13679 7.20711L9 11.0703V1Z" fill="#88DD9F"></path><path d="M0 19C0 18.4477 0.447716 18 1 18H19C19.5523 18 20 18.4477 20 19C20 19.5523 19.5523 20 19 20H1C0.447715 20 0 19.5523 0 19Z" fill="#88DD9F"></path></svg></div> Download </button></center>';
    $(document).on("click", ".app-accordion2__main-buttons .i8-button--primary.i8-button--large.i8-button", function (e) {
        let downloadModalFooterElement = $(document).find(".dim__footer");
        downloadModalFooterElement.after(icons8DownloadButton);
    });

    // Download SVG from Fontawesome
    $(document).on("click","#fontAwesomeSVGDownload", function(){
        let versionSelector = $(document).find("#choose_aversionoffontawesome").val() ?? "6.4.2";
        let url         = `https://site-assets.fontawesome.com/releases/v${versionSelector}/svgs/`;
        const name                    =   $(document).find(".icon-code-snippet.codeblock-tabbed.margin-bottom-xl").attr("id") ?? "";
        const iconFamily          =   $(document).find("#icon_family").val() ?? "classic";
        const activeButton            =   $("#icon_style").find("button.active");
        const iconStyle               =   activeButton.attr("aria-label") || "solid";
        url += (iconFamily.toLowerCase() !== "classic" ? iconFamily.toLowerCase() + "-" : "") + iconStyle.toLowerCase() + "/" + name + ".svg";
        fetch(url).then((res) => {
            res.text().then((text) => {
                downloadIcon(text, name)
            })
        });
    })

    // Download SVG from Icons8
    $(document).on("click", ".download-svg-ry", function(e){
        if(!checkLoggedInStatus())
        {
            Snackbar.show({ text : "Please login to download the icon." });
            return;
        }
        try
        {
            let clickedButtonElement    =   $(this);
            let idElement               =   $("#dim__preview .dim__preview-icons .dim__preview-icon-wrapper");
            let value                   =   idElement.attr("id");
            if(value)
            {
                value   =   value.substring(1);
                value   =   value.substring(0, value.lastIndexOf("-"));
                $.ajax({
                    url         :   `https://api-icons.icons8.com/siteApi/icons/icon?id=${value}&info=true&language=en-US&svg=true`,
                    method      :   "GET",
                    dataType    :   "JSON",
                    beforeSend  :   function (){
                        clickedButtonElement.html(LOADING_ICON);
                    },
                    success     :   function (response){
                        const iconName  = response.icon.name    ?? value;
                        const svg       = response.icon.svg     ?? "";
                        if(svg.length > 0)
                        {
                            downloadIcon(atob(svg), iconName);
                        }
                        else
                        {
                            Snackbar.show({ text : "Icon / Asset is not available in SVG format."});
                        }
                        clickedButtonElement.html('<div data-v-969e794c="" class="dim__primary-btn-icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1C9 0.447715 9.44771 0 10 0C10.5523 0 11 0.447715 11 1V11.0703L14.8632 7.20711C15.2537 6.81658 15.8869 6.81658 16.2774 7.20711L16.3632 7.29289C16.7537 7.68342 16.7537 8.31658 16.3632 8.70711L10 15.0703L3.63679 8.70711C3.24627 8.31658 3.24627 7.68342 3.63679 7.29289L3.72258 7.20711C4.11311 6.81658 4.74627 6.81658 5.13679 7.20711L9 11.0703V1Z" fill="#88DD9F"></path><path d="M0 19C0 18.4477 0.447716 18 1 18H19C19.5523 18 20 18.4477 20 19C20 19.5523 19.5523 20 19 20H1C0.447715 20 0 19.5523 0 19Z" fill="#88DD9F"></path></svg></div> Download')
                    }
                })
            }
        }
        catch(e)
        {
            Snackbar.show({ text : "Something went wrong while downloading the icon, Hot reload the page." });
        }
    })
    initFontAwesome();
    $(document).click();

    if (window.location.href.startsWith('https://fontawesome.com/')){
        initButtonFae();
    }
})



$(document).on("click", function (){
    initFontAwesome();
})

// Download SVG from Iconscout
$(document).on("click", ".download-icon, .copyToClipboardIScout", function(e){
    if(!checkLoggedInStatus())
    {
        Snackbar.show({ text : "Please login to download the icon." });
        return;
    }

    let product_id                  =   0;
    let clickedButtonElement                 =  $(this);
    clickedButtonElement.html(LOADING_ICON);
    $('meta[data-n-head="ssr"][property="og:product_id"]').each(function(){
        product_id                  =   $(this).attr("content");
    })
    if(product_id)
    {
        let propColorEditor     =   $(document).find("#pdpColorEditor-"     + product_id);
        let pdpLottieEditor     =   $(document).find("#pdp-lottie-player-"  + product_id);
        if(propColorEditor.length > 0)
        {
            downloadIcon(propColorEditor.html(), product_id);
            clickedButtonElement.html("Download");
        }
        else if(pdpLottieEditor.length > 0)
        {

            if(clickedButtonElement.hasClass("copyToClipboardIScout"))
            {
                const shadowRoot = pdpLottieEditor[0].shadowRoot;
                const targetDivInShadow = $(shadowRoot).find('#animation');
                let x = targetDivInShadow.html();
            }
            else
            {
                let token = extractTokenFromUrls()[0];
                if(token)
                {
                    fetch(`https://d3cb3akjtc97pv.cloudfront.net/lottie/premium/original/${product_id}.json?token=${token}`).then( response => response.json() ).then( data => {
                        if(data)
                        {
                            downloadJson(data, product_id);
                            clickedButtonElement.html("Download");
                        }
                    })
                }
            }
        }
        else
        {
            Snackbar.show({text : "Unsupported format or icon !"})
            clickedButtonElement.html("Download");
        }
    }
});


// Extract Token
function extractTokenFromUrls() {
    let entries = window.performance.getEntries();
    return entries.filter(entry => entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch').filter(entry => entry.name.includes('?token=')).map(entry => {
        let url = new URL(entry.name);
        return url.searchParams.get('token');
    }) ?? [];
}

// Download SVG from Flaticon
$(document).on("click", ".btn-svg, .copysvg--button", function(e){
    if(!checkLoggedInStatus())
    {
        Snackbar.show({ text : "Please login to download the icon." });
        return;
    }
    try
    {
        let clickedButtonElement    =   $(this);

        $(".modal-download-detail__content").remove();
        $(".detail__editor").addClass("hide");
        $(".detail__top").removeClass("hide");
        clickedButtonElement.html(LOADING_ICON);
        let meta        =   $('meta[name="twitter:image"]').prop("content").replace("https://cdn-icons-png.flaticon.com/", "");
        let metaSplit   =   meta.split("/");
        let iconType    =   $("#detail").attr("data-icon_type");
        let iconId      =   metaSplit[metaSplit.length - 1].replace(".png", "");
        let iconName    =   $(`li.icon--item[data-id='${iconId}']`).attr("data-name");
        if(typeof iconName === "undefined")
        {
            iconName    =   $(`section#detail[data-id='${iconId}']`).attr("data-name");
        }
        if(typeof iconName === "undefined")
        {
            iconName    =   iconId
        }
        fetch(`https://www.flaticon.com/editor/icon/svg/${iconId}?type=${iconType}&_auth_premium_token=${USER.premium_token}`).then( response => response.json() ).then( data => {
            fetch(data.url).then((res) => {
                res.text().then((text) => {
                    if (clickedButtonElement.hasClass("btn-svg"))
                    {
                        downloadIcon(text, `${iconName}`)
                        clickedButtonElement.html("SVG");
                    }
                    else
                    {
                        copyToClipBoard(text, clickedButtonElement, "Copy SVG");
                    }
                })
            });
        })
    }
    catch (e)
    {
        Snackbar.show({ text : "Something went wrong while downloading the icon, Hot reload the page." });
    }
})
