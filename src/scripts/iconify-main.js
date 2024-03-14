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
        let iconScoutPremiumDownloadButton =
            $(`<button type="button" class="btn btn-primary has-icon w-100 btn-lg download-icon">Download</button>`).text("Download").removeAttr("href");
        const button = $("button[class*='btn'][class*='dropdown-toggle'][class*='btn-primary'][class*='w-100'][class*='btn-lg'][class*='has-icon'][class*='dropdown-toggle-no-caret']");
        button.next("ul").remove();
        button.replaceWith(iconScoutPremiumDownloadButton);
    });

    // Options for the observer (which mutations to observe)
    let config = { attributes: true, childList: true, subtree: true };
    observer.observe(targetNode, config);

    // Add download SVG button in Icons8 modal after clicking the original available download button
    let icons8DownloadButton  ='' +
        '<button class="download-svg-ry i8-button--primary i8-button--large i8-button">' +
        '<div class="i8-icon i8-button__icon i8-button__icon--left i8-button__icon i8-button__icon--left" style="--icon-size: 24px;"><svg class="i8-icon-path" preserveAspectRatio="none"><path d="M11.9883 2.98935C11.7896 2.99245 11.6002 3.07432 11.4617 3.21696C11.3233 3.35959 11.2472 3.55135 11.25 3.75009V14.4395L9.53029 12.7198C9.46038 12.6478 9.37674 12.5906 9.28431 12.5515C9.19188 12.5124 9.09255 12.4923 8.9922 12.4923C8.84294 12.4923 8.69709 12.5369 8.5733 12.6203C8.44951 12.7037 8.35342 12.8221 8.29731 12.9604C8.24121 13.0987 8.22765 13.2507 8.25837 13.3967C8.28908 13.5428 8.36268 13.6764 8.46974 13.7804L11.4697 16.7804C11.6104 16.921 11.8011 16.9999 12 16.9999C12.1989 16.9999 12.3896 16.921 12.5303 16.7804L15.5303 13.7804C15.6023 13.7113 15.6597 13.6285 15.6993 13.5369C15.7389 13.4453 15.7598 13.3467 15.7608 13.2469C15.7619 13.1472 15.7429 13.0482 15.7052 12.9558C15.6675 12.8634 15.6117 12.7795 15.5412 12.7089C15.4706 12.6384 15.3867 12.5826 15.2943 12.5449C15.2019 12.5072 15.103 12.4883 15.0032 12.4893C14.9034 12.4903 14.8048 12.5112 14.7132 12.5508C14.6216 12.5904 14.5389 12.6478 14.4697 12.7198L12.75 14.4395V3.75009C12.7515 3.64971 12.7327 3.55006 12.6949 3.45705C12.6572 3.36403 12.6011 3.27955 12.5301 3.20861C12.459 3.13767 12.3745 3.0817 12.2814 3.04404C12.1884 3.00638 12.0887 2.98778 11.9883 2.98935ZM3.7383 15.4893C3.53956 15.4925 3.35017 15.5743 3.21174 15.717C3.07332 15.8596 2.99717 16.0513 3.00002 16.2501V18.2501C3.00002 19.76 4.24013 21.0001 5.75002 21.0001H18.25C19.7599 21.0001 21 19.76 21 18.2501V16.2501C21.0014 16.1507 20.9831 16.052 20.946 15.9598C20.9089 15.8676 20.8539 15.7836 20.7841 15.7129C20.7144 15.6421 20.6312 15.5859 20.5395 15.5475C20.4478 15.5092 20.3494 15.4894 20.25 15.4894C20.1506 15.4894 20.0522 15.5092 19.9605 15.5475C19.8688 15.5859 19.7857 15.6421 19.7159 15.7129C19.6461 15.7836 19.5911 15.8676 19.554 15.9598C19.517 16.052 19.4986 16.1507 19.5 16.2501V18.2501C19.5 18.9492 18.9491 19.5001 18.25 19.5001H5.75002C5.0509 19.5001 4.50002 18.9492 4.50002 18.2501V16.2501C4.50146 16.1497 4.48273 16.0501 4.44495 15.957C4.40717 15.864 4.3511 15.7796 4.28006 15.7086C4.20903 15.6377 4.12447 15.5817 4.03141 15.544C3.93835 15.5064 3.83868 15.4878 3.7383 15.4893Z" style="height: 100%;"></path></svg></div>Iconify Download SVG' +
        '</button>';
    $(document).on("click", ".app-grid-icon", function (e) {
        let downloadModalFooterElement  =   $(document).find(".app-accordion2__main-buttons");
        let existingButton              =   $(document).find(".download-svg-ry");
        if(existingButton.length < 1)
        {
            downloadModalFooterElement.prepend(icons8DownloadButton)
        }
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
            let idElement               =   $(document).find(".i8-link.app-accordion2__name.app-accordion2__name");
            let str                   =   idElement.attr("href");
            if(str)
            {

                let value;
                const regex = /\/icon\/([^\/]+)/;
                const match = str.match(regex);

                if (match) {
                     value = match[1];
                } else {
                    value = "";
                }
                if(value)
                {
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
                            clickedButtonElement.html('<div class="i8-icon i8-button__icon i8-button__icon--left i8-button__icon i8-button__icon--left" style="--icon-size: 24px;"><svg class="i8-icon-path" preserveAspectRatio="none"><path d="M11.9883 2.98935C11.7896 2.99245 11.6002 3.07432 11.4617 3.21696C11.3233 3.35959 11.2472 3.55135 11.25 3.75009V14.4395L9.53029 12.7198C9.46038 12.6478 9.37674 12.5906 9.28431 12.5515C9.19188 12.5124 9.09255 12.4923 8.9922 12.4923C8.84294 12.4923 8.69709 12.5369 8.5733 12.6203C8.44951 12.7037 8.35342 12.8221 8.29731 12.9604C8.24121 13.0987 8.22765 13.2507 8.25837 13.3967C8.28908 13.5428 8.36268 13.6764 8.46974 13.7804L11.4697 16.7804C11.6104 16.921 11.8011 16.9999 12 16.9999C12.1989 16.9999 12.3896 16.921 12.5303 16.7804L15.5303 13.7804C15.6023 13.7113 15.6597 13.6285 15.6993 13.5369C15.7389 13.4453 15.7598 13.3467 15.7608 13.2469C15.7619 13.1472 15.7429 13.0482 15.7052 12.9558C15.6675 12.8634 15.6117 12.7795 15.5412 12.7089C15.4706 12.6384 15.3867 12.5826 15.2943 12.5449C15.2019 12.5072 15.103 12.4883 15.0032 12.4893C14.9034 12.4903 14.8048 12.5112 14.7132 12.5508C14.6216 12.5904 14.5389 12.6478 14.4697 12.7198L12.75 14.4395V3.75009C12.7515 3.64971 12.7327 3.55006 12.6949 3.45705C12.6572 3.36403 12.6011 3.27955 12.5301 3.20861C12.459 3.13767 12.3745 3.0817 12.2814 3.04404C12.1884 3.00638 12.0887 2.98778 11.9883 2.98935ZM3.7383 15.4893C3.53956 15.4925 3.35017 15.5743 3.21174 15.717C3.07332 15.8596 2.99717 16.0513 3.00002 16.2501V18.2501C3.00002 19.76 4.24013 21.0001 5.75002 21.0001H18.25C19.7599 21.0001 21 19.76 21 18.2501V16.2501C21.0014 16.1507 20.9831 16.052 20.946 15.9598C20.9089 15.8676 20.8539 15.7836 20.7841 15.7129C20.7144 15.6421 20.6312 15.5859 20.5395 15.5475C20.4478 15.5092 20.3494 15.4894 20.25 15.4894C20.1506 15.4894 20.0522 15.5092 19.9605 15.5475C19.8688 15.5859 19.7857 15.6421 19.7159 15.7129C19.6461 15.7836 19.5911 15.8676 19.554 15.9598C19.517 16.052 19.4986 16.1507 19.5 16.2501V18.2501C19.5 18.9492 18.9491 19.5001 18.25 19.5001H5.75002C5.0509 19.5001 4.50002 18.9492 4.50002 18.2501V16.2501C4.50146 16.1497 4.48273 16.0501 4.44495 15.957C4.40717 15.864 4.3511 15.7796 4.28006 15.7086C4.20903 15.6377 4.12447 15.5817 4.03141 15.544C3.93835 15.5064 3.83868 15.4878 3.7383 15.4893Z" style="height: 100%;"></path></svg></div>Iconify Download SVG')
                        }
                    })
                }
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
