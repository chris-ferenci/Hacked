function _1(md){return(
md`# Final Project Charts`
)}

function _hibpBreaches(FileAttachment){return(
FileAttachment("Have I Been Pwned — All Breaches.json").json()
)}

function _marketItems(){return(
[
  {nameLines: ["Name"], inProfile: true, priceDescription: "< $0.01", priceOnScale: 2},
  {nameLines: ["Home Address"], inProfile: true, priceDescription: "< $0.01", priceOnScale: 2},
  {nameLines: ["Email Address"], inProfile: true, priceDescription: "< $0.02", priceOnScale: 2},
  {nameLines: ["Phone Number"], inProfile: true, priceDescription: "< $0.02", priceOnScale: 2},
  {nameLines: ["SSN"], inProfile: true, priceDescription: "$1", priceOnScale: 4},
  {nameLines: ["Social Media", "Login"], priceDescription: "$40", priceOnScale: 40},
  {nameLines: ["Bank Login"], priceDescription: "$45", priceOnScale: 45},
  {nameLines: ["Credit Card"], priceDescription: "$50", priceOnScale: 50},
  {nameLines: ["Email Login"], priceDescription: "$65", priceOnScale: 65},
  {nameLines: ["Cryptocurrency", "Exchange Login"], priceDescription: "$200", priceOnScale: 200},
  {nameLines: ["Combined", "Profile"], inProfile: true, priceDescription: "$1,000",
   priceOnScale: 1000}
]
)}

function _combinedProfileItem(marketItems){return(
marketItems[marketItems.length - 1]
)}

function _combinedProfileItemIndex(marketItems){return(
marketItems.length - 1
)}

function _combineButtonWasClicked(Inputs){return(
Inputs.button("Reset", {
  value: false,
  reduce: ((currentValue) => {
    return !currentValue
  })
})
)}

function _infoPricesAnimatedChart(width,marketItems,combinedProfileItem,d3,combinedProfileItemIndex,combineButtonWasClicked)
{


  const height = 700
  const margins = {top: 20, bottom: 20, left: 34, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)


  const marketItemsBefore = marketItems.filter(item => (item != combinedProfileItem))
  const inMarketItemsBefore = (item => (marketItemsBefore.indexOf(item) >= 0))


  const barY = d3.scaleBand()
    .domain(d3.range(marketItems.length))
    .range([0, contentHeight])
    .paddingOuter(0.5)
    .paddingInner(0.2)

  const barXBefore = d3.scaleLinear()
    .domain([
      0,
      d3.max(marketItems, (item => item.priceOnScale)) * 1.2
    ])
    .range([0, contentWidth])

  const barXAfter = d3.scaleLinear()
    .domain([
      0,
      d3.max(marketItems, (item => item.priceOnScale)) * 1.2
    ])
    .range([0, contentWidth])


  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")

  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "rgb(241, 237, 253") // TEMPORARY
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )


  function xAxis(scale) {
    return d3.axisBottom(scale)
      .tickFormat(d3.format("$,"))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .tickValues(d => "")
  }

  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(barXBefore))

  const yAxisGroup = (
    svgContent.append("g")
  )
  yAxisGroup.call(yAxis(barY))


  const bars = (
    svgContent.append("g")
      .selectAll("rect")
      .data(marketItems)
      .join("rect")
      .attr("x", 0)
      .attr("y", ((item, index) => barY(index)))
      .attr("height", barY.bandwidth())
      .attr("fill", (item => ((item.inProfile) ? "#2e1683" : "#5e3bde")))
  )
  bars.filter(inMarketItemsBefore)
    .attr("width", (item => barXBefore(item.priceOnScale)))


  const textSize = 14
  const barLabelOffset = 14


  const profileBoxGroup = svgContent.append("g")

  const profileBoxHeight = 100
  const profileBoxX = (barXAfter(combinedProfileItem.priceOnScale) + barLabelOffset)
  const profileBoxY = (barY(combinedProfileItemIndex) + (barY.bandwidth() * 1.42) - profileBoxHeight)
  const profileBox = (
    profileBoxGroup.append("rect")
      .attr("x", profileBoxX)
      .attr("y", profileBoxY)
      .attr("width", (barY.bandwidth() * 2.7))
      .attr("height", profileBoxHeight)
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("fill", "rgb(251, 251, 255)")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )

  const profileBoxNameLabel = (
    profileBoxGroup.append("text")
      .text(combinedProfileItem.nameLines.join(" "))
      .attr("x", profileBoxX)
      .attr("y", (profileBoxY - (textSize * 2) - 6))
      .attr("font-weight", 600)
      .attr("fill", "#241267")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )

  const profileBoxPriceLabel = (
    profileBoxGroup.append("text")
      .text(combinedProfileItem.priceDescription)
      .attr("x", profileBoxX)
      .attr("y", (profileBoxY - (textSize - 2)))
      .attr("font-weight", 500)
      .attr("fill", "#603dde")
      .attr("opacity", 0)
      .style("visibility", "hidden")
  )


  function createBarNameLabels(parentGroup, marketItems) {
    return (
      parentGroup
        .selectAll("text")
        .data(marketItems)
        .join("text")
        .text(item => item.nameLines.join(" "))
        .attr("x", ((item, index) => (barXBefore(item.priceOnScale) + barLabelOffset)))
        .attr("y", ((item, index) => (barY(index) + (barY.bandwidth() / 2) - 4)))
        .attr("font-size", textSize)
        .attr("font-weight", 600)
        .attr("fill", "#241267")
    )
  }

  const barNameLabels = createBarNameLabels(
    svgContent.append("g"),
    marketItemsBefore
  )

  const movingBarNameLabelCopies = createBarNameLabels(
    svgContent.append("g"),
    marketItemsBefore.filter(item => item.inProfile)
  )
  .attr("visibility", "hidden")


  const barPriceLabels = (
    svgContent.append("g")
      .selectAll("text")
      .data(marketItemsBefore)
      .join("text")
      .text(item => item.priceDescription)
      .attr("x", ((item, index) => barXBefore(item.priceOnScale) + barLabelOffset))
      .attr("y", ((item, index) => barY(index) + (barY.bandwidth() / 2) + textSize))
      .attr("font-size", textSize)
      .attr("fill", "#603dde")
  )

  const infoCard = containerDiv.append("div")
    .style("visibility", "hidden")
    .style("position", "absolute")
    .attr("transform", `translate(${margins.left}, ${margins.top})`)
    .style("max-width", "400px")
    .style("padding", "24px")
    .style("border-radius", "20px")
    .style("font-size", "12px")
    .style("background-color", "rgb(251, 251, 255)")
    .style("box-shadow", "rgba(0, 0, 0, 0.14) 0px 3px 17px")

  const infoCardContent = (
    infoCard.append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("gap", "22px")
  )

  const stepButtonsContainer = infoCard.append("div")
    .style("display", "flex")
    .style("justify-content", "space-between")

  const previousStepButton = (
    stepButtonsContainer.append("button")
      .text("Back")
      .attr("class", "idb-previous-step-button")
      .on("click", (clickEvent => {
        currentStepIndex -= 1
        moveToCurrentStep()
      }))
  )

  const nextStepButton = (
    stepButtonsContainer.append("button")
      .text("Next")
      .attr("class", "idb-next-step-button")
      .on("click", (clickEvent => {
        currentStepIndex += 1
        moveToCurrentStep()
      }))
  )

  const infoCardLine = svgContent.append("line")
    .style("stroke", "#baa6f5")
    .style("stroke-width", "3")
    .style("visibility", "hidden")

  const infoCardSteps = [
    {
      itemIndex: 2,
      itemLabelWidth: 91,
      caption: "<strong>Email addresses</strong> are sold in bulk, often for less than $0.00001 a piece, because they are only useful for spamming and marketing.",
      icon: '<svg width="90px" viewBox="0 0 43 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="36" cy="7" r="7" fill="#D73131" fill-opacity="0.35"/> <path d="M2.63426 7C2.11642 7 1.64114 7.15674 1.23473 7.41466L16.6553 20.6429C17.4757 21.3469 18.4949 21.3469 19.3168 20.6429L34.7649 7.41466C34.3585 7.15674 33.8832 7 33.3653 7H2.63426ZM0.150976 8.78298C0.0569626 9.05603 0 9.34728 0 9.65362V27.346C0 28.8161 1.17469 30 2.63428 30H33.3657C34.8249 30 36 28.8165 36 27.346V9.65362C36 9.34725 35.943 9.056 35.849 8.78298L20.4559 21.9827C19.0285 23.2054 16.9439 23.2073 15.5169 21.9827L0.150976 8.78298Z" fill="#754EEB"/> <circle cx="36" cy="7" r="5" fill="#D73131"/> </svg>'
    },
    {
      itemIndex: 8,
      itemLabelWidth: 73,
      caption: "<strong>Email logins</strong> are sold for around $65 — these are valuable because they can be used to reset your passwords and gain access to lots of other services.",
      icon: '<svg width="82px" viewBox="0 0 36 51" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="5" y="6" width="27" height="24" fill="#C4B421" fill-opacity="0.31"/> <path d="M20.1172 15.9788C19.4656 15.6313 18.7385 15.4496 18 15.4496C17.2615 15.4496 16.5344 15.6313 15.8828 15.9788L2.38275 23.1788C1.66293 23.5626 1.06098 24.1348 0.641282 24.8343C0.221582 25.5338 -8.1555e-05 26.3343 2.25088e-08 27.15V27.8565L15.0953 36.7035L18 35.088L20.9048 36.7035L36 27.8565V27.15C36.0001 26.3343 35.7784 25.5338 35.3587 24.8343C34.939 24.1348 34.3371 23.5626 33.6172 23.1788L20.1172 15.9788V15.9788ZM36 30.4643L23.1908 37.9725L36 45.087V30.462V30.4643ZM35.8672 47.589L18 37.662L0.13275 47.589C0.375758 48.5633 0.937668 49.4284 1.72906 50.0465C2.52044 50.6646 3.49583 51.0002 4.5 51H31.5C32.5042 51.0002 33.4796 50.6646 34.2709 50.0465C35.0623 49.4284 35.6242 48.5633 35.8672 47.589ZM2.25088e-08 45.0893L12.8092 37.9725L2.25088e-08 30.4643V45.0893V45.0893Z" fill="#754EEB"/> <rect x="7" y="4" width="5" height="4" fill="white"/> <path d="M11.0958 12C10.0047 11.9998 8.93372 11.7114 7.99448 11.1651C7.05524 10.6187 6.28219 9.83433 5.75598 8.89377C5.22977 7.9532 4.96967 6.89091 5.00282 5.81771C5.03596 4.74451 5.36115 3.69972 5.94444 2.79234C6.52773 1.88496 7.34777 1.14824 8.31899 0.659019C9.29022 0.169799 10.3771 -0.0539877 11.4661 0.0110035C12.5552 0.0759947 13.6066 0.427382 14.5106 1.02851C15.4146 1.62964 16.1382 2.45848 16.6058 3.42857H29.387L32 6L29.387 8.57143L27.645 6.85714L25.9029 8.57143L24.1609 6.85714L22.4189 8.57143L20.6769 6.85714L18.9349 8.57143H16.6058C16.1112 9.59748 15.3309 10.4643 14.3555 11.0713C13.3802 11.6782 12.2498 12.0002 11.0958 12V12ZM9.35378 7.71429C9.8158 7.71429 10.2589 7.53367 10.5856 7.21218C10.9123 6.89069 11.0958 6.45466 11.0958 6C11.0958 5.54534 10.9123 5.10931 10.5856 4.78782C10.2589 4.46633 9.8158 4.28572 9.35378 4.28572C8.89177 4.28572 8.44868 4.46633 8.12199 4.78782C7.7953 5.10931 7.61177 5.54534 7.61177 6C7.61177 6.45466 7.7953 6.89069 8.12199 7.21218C8.44868 7.53367 8.89177 7.71429 9.35378 7.71429V7.71429Z" fill="#C4B421"/> </svg>'
    },
    {
      itemIndex: 9,
      itemLabelWidth: 205,
      caption: "<strong>PayPal and cryptocurrency exchange logins</strong> sell for $100–$500, because the funds in those accounts can be withdrawn immediately.",
      icon: '<svg width="72px" viewBox="0 0 38 58" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M28.6011 2.64647C27.0226 0.858434 24.1693 0.0918579 20.519 0.0918579H9.92496C9.5638 0.0918712 9.21449 0.219925 8.93983 0.452998C8.66518 0.68607 8.48319 1.00887 8.42659 1.36337L4.01541 29.1676C3.92773 29.7159 4.35492 30.2124 4.91407 30.2124H11.4545L13.0971 19.858L13.0461 20.1823C13.1631 19.4504 13.7929 18.9105 14.5388 18.9105H17.6468C23.7524 18.9105 28.5332 16.4459 29.9298 9.3161C29.9712 9.10523 30.0071 8.9 30.0382 8.69949C29.8619 8.60672 29.8619 8.60672 30.0382 8.69949C30.454 6.06426 30.0353 4.27048 28.6011 2.64647" fill="#27346A"/> <path d="M15.5997 7.75019C15.7785 7.66557 15.974 7.62172 16.1721 7.62184H24.4776C25.4611 7.62184 26.3785 7.68545 27.2168 7.81954C27.4513 7.85671 27.6847 7.90109 27.9165 7.95261C28.2451 8.02467 28.5698 8.11285 28.8896 8.21684C29.3017 8.35363 29.6855 8.51294 30.0383 8.69949C30.454 6.06325 30.0353 4.27048 28.6011 2.64647C27.0217 0.858434 24.1693 0.0918579 20.519 0.0918579H9.92405C9.17809 0.0918579 8.54349 0.63158 8.42659 1.36337L4.01541 29.1666C3.92774 29.7158 4.35492 30.2116 4.91317 30.2116H11.4545L14.8623 8.73416C14.8958 8.52306 14.9804 8.3232 15.1089 8.1518C15.2373 7.98039 15.4058 7.84257 15.5997 7.75019V7.75019Z" fill="#27346A"/> <path d="M29.9298 9.31611C28.5332 16.4449 23.7525 18.9105 17.6468 18.9105H14.5379C13.7921 18.9105 13.1621 19.4504 13.0462 20.1823L11.0027 33.0567C10.9264 33.5365 11.2998 33.9713 11.7882 33.9713H17.3016C17.6175 33.9712 17.9229 33.8591 18.163 33.6552C18.4031 33.4513 18.5621 33.169 18.6115 32.859L18.6652 32.5798L19.7043 26.0347L19.7713 25.6729C19.8206 25.3629 19.9796 25.0806 20.2197 24.8767C20.4598 24.6728 20.7652 24.5607 21.081 24.5606H21.9062C27.247 24.5606 31.429 22.4042 32.6511 16.1676C33.1612 13.5613 32.8973 11.3853 31.5479 9.85684C31.1386 9.3939 30.6303 9.01157 30.0382 8.69949C30.0061 8.90102 29.9713 9.10524 29.9298 9.31611V9.31611Z" fill="#2790C3"/> <path d="M28.5766 8.12037C28.3589 8.05717 28.139 8.00123 27.9175 7.95262C27.6856 7.90194 27.4523 7.85786 27.2178 7.82045C26.3786 7.68546 25.4619 7.62174 24.4775 7.62174H16.173C15.9748 7.62129 15.7791 7.66552 15.6006 7.7511C15.4065 7.8432 15.2378 7.98094 15.1093 8.15239C14.9808 8.32384 14.8963 8.52384 14.8631 8.73507L13.098 19.858L13.047 20.1823C13.1631 19.4504 13.793 18.9105 14.5389 18.9105H17.6478C23.7534 18.9105 28.5341 16.4459 29.9307 9.31611C29.9722 9.10524 30.0071 8.9009 30.0392 8.69949C29.6855 8.51396 29.3027 8.35364 28.8905 8.21775C28.7865 8.18348 28.6819 8.15101 28.5767 8.12037" fill="#1F264F"/> <path d="M38 49.5L19.8359 41V45.5794H7V53.4206H19.8359V58L38 49.5Z" fill="#5BAE44" fill-opacity="0.39"/> <path d="M30 49.5L12.4219 41V45.5794H0V53.4206H12.4219V58L30 49.5Z" fill="#5BAE44"/> </svg> '
    },
    {
      itemIndex: 4,
      itemLabelWidth: 149,
      caption: "<strong>Comprehensive profiles are much more useful than individual bits of personal information</strong> — if an attacker has enough information to “prove” to a bank or company that they are you, they can make off with a lot of money. Your social security number by itself will sell for only $1-2. But see just how much more valuable it gets when it’s combined with your name, mailing address, and phone number:",
      icon: '<svg width="82px" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3.62477 0C2.66342 0 1.74145 0.381918 1.06167 1.06174C0.381895 1.74156 0 2.66359 0 3.625V21.75C0 22.7114 0.381895 23.6334 1.06167 24.3133C1.74145 24.9931 2.66342 25.375 3.62477 25.375H13.0437C12.6178 23.9975 12.433 22.301 13.2304 21.025C13.4733 20.5991 13.7995 20.2348 14.1783 19.9375H11.7805C11.5402 19.9375 11.3097 19.842 11.1397 19.6721C10.9698 19.5021 10.8743 19.2716 10.8743 19.0312C10.8743 18.7909 10.9698 18.5604 11.1397 18.3904C11.3097 18.2205 11.5402 18.125 11.7805 18.125H17.0509C16.559 17.3041 16.3031 16.3633 16.3115 15.4062C16.3115 15.0963 16.335 14.7936 16.3822 14.5H11.7805C11.5402 14.5 11.3097 14.4045 11.1397 14.2346C10.9698 14.0646 10.8743 13.8341 10.8743 13.5938C10.8743 13.3534 10.9698 13.1229 11.1397 12.9529C11.3097 12.783 11.5402 12.6875 11.7805 12.6875H17.002C17.9191 11.0418 19.668 9.96875 21.7486 9.96875C22.6548 9.96875 23.561 10.15 24.4672 10.6937C24.7935 10.875 25.0961 11.0925 25.3734 11.3372V3.625C25.3734 2.66359 24.9915 1.74156 24.3117 1.06174C23.632 0.381918 22.71 0 21.7486 0H3.62477ZM8.15574 7.70312C8.15574 8.06365 8.01253 8.40942 7.75761 8.66435C7.5027 8.91928 7.15696 9.0625 6.79645 9.0625C6.43594 9.0625 6.0902 8.91928 5.83529 8.66435C5.58037 8.40942 5.43716 8.06365 5.43716 7.70312C5.43716 7.3426 5.58037 6.99683 5.83529 6.7419C6.0902 6.48697 6.43594 6.34375 6.79645 6.34375C7.15696 6.34375 7.5027 6.48697 7.75761 6.7419C8.01253 6.99683 8.15574 7.3426 8.15574 7.70312ZM6.79645 14.5C6.43594 14.5 6.0902 14.3568 5.83529 14.1018C5.58037 13.8469 5.43716 13.5012 5.43716 13.1406C5.43716 12.7801 5.58037 12.4343 5.83529 12.1794C6.0902 11.9245 6.43594 11.7812 6.79645 11.7812C7.15696 11.7812 7.5027 11.9245 7.75761 12.1794C8.01253 12.4343 8.15574 12.7801 8.15574 13.1406C8.15574 13.5012 8.01253 13.8469 7.75761 14.1018C7.5027 14.3568 7.15696 14.5 6.79645 14.5ZM8.15574 18.5781C8.15574 18.9387 8.01253 19.2844 7.75761 19.5393C7.5027 19.7943 7.15696 19.9375 6.79645 19.9375C6.43594 19.9375 6.0902 19.7943 5.83529 19.5393C5.58037 19.2844 5.43716 18.9387 5.43716 18.5781C5.43716 18.2176 5.58037 17.8718 5.83529 17.6169C6.0902 17.362 6.43594 17.2188 6.79645 17.2188C7.15696 17.2188 7.5027 17.362 7.75761 17.6169C8.01253 17.8718 8.15574 18.2176 8.15574 18.5781V18.5781ZM11.7805 7.25H19.0301C19.2704 7.25 19.5009 7.34548 19.6708 7.51543C19.8408 7.68539 19.9363 7.9159 19.9363 8.15625C19.9363 8.3966 19.8408 8.62711 19.6708 8.79707C19.5009 8.96702 19.2704 9.0625 19.0301 9.0625H11.7805C11.5402 9.0625 11.3097 8.96702 11.1397 8.79707C10.9698 8.62711 10.8743 8.3966 10.8743 8.15625C10.8743 7.9159 10.9698 7.68539 11.1397 7.51543C11.3097 7.34548 11.5402 7.25 11.7805 7.25ZM23.561 12.267C23.1487 12.029 22.6935 11.8745 22.2215 11.8124C21.7494 11.7503 21.2698 11.7818 20.8099 11.9051C19.8812 12.1541 19.0894 12.7618 18.6087 13.5947C18.128 14.4275 17.9978 15.4171 18.2468 16.346C18.4958 17.2748 19.1035 18.0666 19.9363 18.5473C20.769 19.028 21.7586 19.1582 22.6874 18.9092C23.6161 18.6602 24.4079 18.0525 24.8886 17.2197C25.3693 16.3868 25.4994 15.3972 25.2505 14.4684C25.0015 13.5396 24.3938 12.7477 23.561 12.267ZM14.4991 23.1094C14.4991 21.8588 15.514 20.8438 16.7646 20.8438H26.7327C27.9833 20.8438 28.9982 21.8588 28.9982 23.1094V23.2689C29 23.3976 29.0018 23.5263 28.9964 23.6549C28.9795 23.9315 28.9395 24.2061 28.8768 24.476C28.7205 25.1475 28.4375 25.7829 28.0431 26.3483C27.0499 27.7621 25.165 29 21.7486 29C18.8289 29 17.0256 28.0938 15.9472 26.9519C15.2922 26.2598 14.8347 25.4049 14.6223 24.476C14.559 24.2062 14.5184 23.9315 14.5009 23.6549L14.4991 23.1148V23.1094Z" fill="#754EEB"/> </svg> '
    }
  ]

  var currentStepIndex = 0

  function infoCardContentsForStep(step) {
    var contents = ""
    contents += step.icon
    contents += '<p style="flex-shrink: 2; font-size: 16px">' + step.caption + '</p>'
    return contents
  }

  function moveToCurrentStep() {
    if (currentStepIndex >= infoCardSteps.length) {
      infoCard
        .transition()
        .duration(400)
        .ease(d3.easeCubic)
        .style("opacity", 0)
      infoCardLine
        .transition()
        .duration(400)
        .ease(d3.easeCubic)
        .style("opacity", 0)
        .on("end", (() => {
          movingBarNameLabelCopies
            .transition()
            .delay(195)
            .attr("visibility", "visible")
          standardTransition(movingBarNameLabelCopies)
            .delay(200)
            .attr("x", (profileBoxX + 12))
            .attr("y", ((item, index) => ((profileBoxY + 23) + (index * (textSize + 2)))))
          // standardTransition(barPriceLabels.filter(item => item.inProfile))
          //   .delay(200)
          //   .attr("opacity", 0)
          .on("end", (() => {
            standardTransition(profileBox)
              .duration(1000)
              .attr("opacity", 1)
              .style("visibility", "visible")
            .on("end", (() => {
              standardTransition(bars)
                .attr("width", (item => barXAfter(item.priceOnScale)))
              .on("end", (() => {
                standardTransition(profileBoxNameLabel)
                  .attr("opacity", 1)
                  .style("visibility", "visible")
                standardTransition(profileBoxPriceLabel)
                  .attr("opacity", 1)
                  .style("visibility", "visible")
              }))
            }))
          }))
        }))
      return
    }
    const step = infoCardSteps[currentStepIndex]
    const item = marketItems[step.itemIndex]
    const lineX1 = (barXBefore(item.priceOnScale) + barLabelOffset + step.itemLabelWidth + 20)
    const lineY1 = (barY(step.itemIndex) + (barY.bandwidth() / 2))
    const lineX2 = lineX1 + 100
    const lineY2 = lineY1 - 60
    infoCardLine
      .transition()
      .duration(400)
      .ease(d3.easeCubic)
      .attr("x1", lineX1)
      .attr("y1", lineY1)
      .attr("x2", lineX2)
      .attr("y2", lineY2)
    infoCard
      .transition()
      .duration(400)
      .ease(d3.easeCubic)
      .style("top", `${lineY2 - 50}px`)
      .style("left", `${lineX2 + 20}px`)
      .on("end", (() => {
        infoCardContent
          .html(infoCardContentsForStep(step))
        previousStepButton
          .attr("disabled", ((currentStepIndex == 0) ? "true" : null))
        nextStepButton
          .text((currentStepIndex == (infoCardSteps.length - 1)) ? "Combine" : "Next")
        infoCard
          .style("visibility", "visible")
        infoCardLine
          .style("visibility", "visible")
      }))
  }

  moveToCurrentStep()


  if (combineButtonWasClicked) {
    // ...
  }


  function standardTransition(selection) {
    return selection
      .transition()
      .duration(1500)
      .ease(d3.easeCubic)
  }


  return containerDiv.node()


}


function _prcBreaches(FileAttachment){return(
FileAttachment("Privacy Rights Clearinghouse Data Breach Database.csv").csv()
)}

function _yearOfPRCBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%m/%d/%Y")
  return (breach => breachYearParser(breach["Date Made Public"]).getFullYear())
}


function _prcYearsDomain(d3){return(
d3.range(2005, 2017 + 1)
)}

function _organizationTypeCodes(){return(
new Map([
  ["Financial Businesses", "BSF"],
  ["Retail Businesses", "BSR"],
  ["Other Businesses", "BSO"],
  ["Educational Institutions", "EDU"],
  ["Governments and Militaries", "GOV"],
  ["Healthcare Providers", "MED"],
  ["Non-Profits", "NGO"]
])
)}

function _prcBreachesInYearForOrganizationType(prcBreaches,yearOfPRCBreachAsInt){return(
function prcBreachesInYearForOrganizationType(year, organizationTypeCode) {
  return prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] == organizationTypeCode)
  )).length
}
)}

function _organizationTypeLines(organizationTypes,organizationTypeCodes,prcYearsDomain,relativeNumberOfBreaches){return(
organizationTypes.map(organizationType => {
  let organizationTypeCode = organizationTypeCodes.get(organizationType)
  return prcYearsDomain.map(year => relativeNumberOfBreaches(year, organizationTypeCode))
})
)}

function _organizationTypes(organizationTypeCodes){return(
Array.from(organizationTypeCodes.keys())
)}

function _relativeNumberOfBreaches(prcBreachesInYearForOrganizationType){return(
function relativeNumberOfBreaches(year, organizationTypeCode) {
  return (
    parseFloat(prcBreachesInYearForOrganizationType(year, organizationTypeCode))
    / parseFloat(prcBreachesInYearForOrganizationType(2005, organizationTypeCode))
  )
}
)}

function _breachTargetsChart(width,d3,prcYearsDomain,organizationTypeLines,organizationTypes)
{


  const height = 480
  const margins = {top: 20, bottom: 20, left: 42, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)

  const lineLabelsWidth = 230

  const xScale = d3.scaleLinear()
    .domain([prcYearsDomain[0], prcYearsDomain[prcYearsDomain.length - 1]])
    .range([0, (contentWidth - lineLabelsWidth)])

  xScale.range

  const yScale = d3.scaleLog()
    .domain([d3.min(organizationTypeLines.flat()), d3.max(organizationTypeLines.flat())])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )

  
  svgContent.append("g")
    .selectAll("text")
    .data(["Number of breaches", "relative to 2005"])
    .join("text")
      .text(text => text)
      .attr("x", 8)
      .attr("y", ((text, index) => (10 + (index * 16))))
      .style("font-size", "13px")

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .ticks(6)
      .tickFormat(d3.format(new d3.FormatSpecifier({comma: false})))
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .tickValues([1, 2, 3, 4, 10, 20, 30, 40])
      .tickFormat(n => `${n}×`)
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(xScale))

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(yScale))


  const lineColors = new Map([
    [5, "#32188d"],
    [2, "#603dde"],
    [6, "#0f5734"],
    [4, "#1a9a5c"],
    [0, "#147848"],
    [1, "#20bc70"],
    [3, "#23cc7a"]
  ])

  const defaultHighlightedLineIndices = [5, 2]
  
  const defaultLineColor = "black"
  const defaultLineOpacity = 0.08
  const defaultLabelOpacity = 0.2


  const organizationTypeGroups = (
    svgContent.append("g")
      .selectAll("g")
      .data(organizationTypeLines)
      .join("g")
      .attr("d-index", ((line, index) => index))
      .attr("d-highlighted", ((line, index) => (defaultHighlightedLineIndices.indexOf(index) >= 0)))
  )


  function darkenLineAndLabel(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    if (organizationTypeGroup.attr("d-highlighted") == "true") {
      return
    }
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    path
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("stroke", (line => {
        const index = parseInt(organizationTypeGroup.attr("d-index"))
        return lineColors.get(index)
      }))
      .attr("opacity", "0.3")
    lineLabel
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("fill", (line => {
        const index = parseInt(organizationTypeGroup.attr("d-index"))
        return lineColors.get(index)
      }))
      .attr("opacity", "0.77")
  }

  function resetLineAndLabel(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    if (organizationTypeGroup.attr("d-highlighted") == "true") {
      return
    }
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    path
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("stroke", defaultLineColor)
      .attr("opacity", defaultLineOpacity)
    lineLabel
      .transition()
      .duration(40)
      .ease(d3.easeCubic)
      .attr("fill", defaultLineColor)
      .attr("opacity", defaultLabelOpacity)
  }

  function toggleLineAndLabelHighlight(element) {
    const organizationTypeGroup = d3.select(element.parentNode)
    const path = organizationTypeGroup.select("path")
    const lineLabel = organizationTypeGroup.select("text")
    if (organizationTypeGroup.attr("d-highlighted") == "false") {
      darkenLineAndLabel(element)
      organizationTypeGroup.attr("d-highlighted", "true")
      path
        .transition()
        .duration(40)
        .ease(d3.easeCubic)
        .attr("stroke", (line => {
          const index = parseInt(organizationTypeGroup.attr("d-index"))
          return lineColors.get(index)
        }))
        .attr("opacity", 1)
      lineLabel
        .transition()
        .duration(40)
        .ease(d3.easeCubic)
        .attr("fill", (line => {
          const index = parseInt(organizationTypeGroup.attr("d-index"))
          return lineColors.get(index)
        }))
        .attr("opacity", 1)
    }
    else {
      organizationTypeGroup.attr("d-highlighted", "false")
      resetLineAndLabel(element)
    }
  }

  
  organizationTypeGroups.append("path")
    .attr("d", d3.line()
      .x((point, index) => xScale(prcYearsDomain[index]))
      .y((point, index) => yScale(point))
    )
    .attr("fill", "none")
    .attr("stroke", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? lineColors.get(index) : defaultLineColor)
    )))
    .attr("stroke-width", 7)
    .attr("opacity", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? 1 : defaultLineOpacity)
    )))
    .on("mouseover", (mouseoverEvent => {
      darkenLineAndLabel(mouseoverEvent.srcElement)
    }))
    .on("mouseout", (mouseoutEvent => {
      resetLineAndLabel(mouseoutEvent.srcElement)
    }))
    .on("click", (clickEvent => {
      toggleLineAndLabelHighlight(clickEvent.srcElement)
    }))
    .style("cursor", "pointer")

  
  organizationTypeGroups.append("text")
    .text((line, index) => organizationTypes[index])
    .attr("x", ((contentWidth - lineLabelsWidth) + 20))
    .attr("y", (line => yScale(line[line.length - 1]) + 5))
    .attr("fill", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? lineColors.get(index) : defaultLineColor)
    )))
    .attr("opacity", ((line, index) => (
      ((defaultHighlightedLineIndices.indexOf(index) >= 0) ? 1 : defaultLabelOpacity)
    )))
    .on("mouseover", (mouseoverEvent => {
      darkenLineAndLabel(mouseoverEvent.srcElement)
    }))
    .on("mouseout", (mouseoutEvent => {
      resetLineAndLabel(mouseoutEvent.srcElement)
    }))
    .on("click", (clickEvent => {
      toggleLineAndLabelHighlight(clickEvent.srcElement)
    }))
    .style("cursor", "pointer")


  return containerDiv.node()

  
}


function _prcNonHealthcareBreachesInYear(prcBreaches,yearOfPRCBreachAsInt){return(
function prcNonHealthcareBreachesInYear(year) {
  return prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] != "MED")
  )).length
}
)}

function _prcPercentOfNonHealthcareBreachesInYearForMethodType(prcBreaches,yearOfPRCBreachAsInt){return(
function prcPercentOfNonHealthcareBreachesInYearForMethodType(year, methodTypeCode) {
  const allNonHealthcareBreaches = prcBreaches.filter(breach => (
    (yearOfPRCBreachAsInt(breach) == year)
    && (breach["Type of organization"] != "MED")
  ))
  return (
    allNonHealthcareBreaches.filter(breach => (breach["Type of breach"] == methodTypeCode)).length
    / allNonHealthcareBreaches.length
  )
}
)}

function _yearPercentsBarChart(width,d3){return(
function yearPercentsBarChart(yearsDomain, percentOfBreachesForYear, chartColor, axisLabel) {
  

  const height = 182
  const margins = {top: 30, bottom: 20, left: 44, right: 20}
  const contentWidth = (width - margins.left - margins.right)
  const contentHeight = (height - margins.top - margins.bottom)

  
  const barX = d3.scaleBand()
    .domain(yearsDomain)
    .range([0, contentWidth])
    .paddingOuter(0.2)
    .paddingInner(0.14)

  const barY = d3.scaleLinear()
    .domain([0, 1])
    .range([contentHeight, 0])

  
  const containerDiv = d3.create("div")
    .style("font-family", "-apple-system, system-ui, sans-serif")
  
  const svg = (
    containerDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
  )

  const svgContent = (
    svg.append("g")
      .attr("transform", `translate(${margins.left}, ${margins.top})`)
      .append("g")
  )


  svg.append("g")
    .selectAll("text")
    .data([axisLabel])
    .join("text")
      .text(text => text)
      .attr("x", (margins.left + 12))
      .attr("y", ((text, index) => (14 + (index * 16))))
      .attr("fill", "#747474")
      .style("font-size", "13px")

  
  function xAxis(scale) {
    return d3.axisBottom(scale)
      .tickSize(0)
      .tickPadding(8)
  }

  function yAxis(scale) {
    return d3.axisLeft(scale)
      .ticks(4)
      .tickFormat(d3.format(".0%"))
  }
  
  const xAxisGroup = (
    svgContent.append("g")
      .attr("transform", `translate(0, ${contentHeight})`)
      .style("font-family", "-apple-system, system-ui, sans-serif")
      .style("font-size", "13px")
  )
  xAxisGroup.call(xAxis(barX))
    .call(xAxisGroup => xAxisGroup.select(".domain").remove())

  const yAxisGroup = (
    svgContent.append("g")
    .style("font-family", "-apple-system, system-ui, sans-serif")
    .style("font-size", "13px")
  )
  yAxisGroup.call(yAxis(barY))
    .call(yAxisGroup => yAxisGroup.select(".domain").remove())


  function setPercentageLabelVisibility(yearGroup, newVisibility) {
    const percentageLabel = yearGroup.select("text")
    percentageLabel
      .transition()
      .duration(120)
      .ease(d3.easeCubic)
      .attr("opacity", ((newVisibility == "visible") ? 1 : 0))
      .attr("visibility", newVisibility)
  }
  
  
  const yearGroups = (
    svgContent.append("g")
      .selectAll("g")
      .data(yearsDomain)
      .join("g")
        .attr("transform", (year => `translate(${barX(year)}, 0)`))
        .on("mouseover", (mouseoverEvent => {
          const yearGroup = d3.select(mouseoverEvent.srcElement.parentNode)
          setPercentageLabelVisibility(yearGroup, "visible")
        }))
        .on("mouseout", (mouseoutEvent => {
          const yearGroup = d3.select(mouseoutEvent.srcElement.parentNode)
          setPercentageLabelVisibility(yearGroup, "hidden")
        }))
  )

  const barCornerRadius = 4

  const backgroundWholeBars = (
    yearGroups.append("rect")
      .attr("y", 0)
      .attr("width", barX.bandwidth())
      .attr("height", contentHeight)
      .attr("fill", chartColor)
      .attr("opacity", 0.28)
      .attr("rx", barCornerRadius)
  )

  const yearPercentageBars = (
    yearGroups.append("rect")
      .attr("y", (year => barY(percentOfBreachesForYear(year))))
      .attr("width", barX.bandwidth())
      .attr("height", (year => (
        (contentHeight - barY(percentOfBreachesForYear(year)))
      )))
      .attr("fill", chartColor)
      .attr("rx", barCornerRadius)
  )

  const percentageLabels = (
    yearGroups.append("text")
      .text(year => d3.format(".0%")(percentOfBreachesForYear(year)))
      .attr("x", (barX.bandwidth() / 2))
      .attr("y", (year => (barY(percentOfBreachesForYear(year)) - 10)))
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", chartColor)
      .attr("visibility", "hidden")
  )
  

  return containerDiv.node()

  
}
)}

function _hackBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "HACK")
)), "#603dde", "Percent of breaches caused by hacks")
)}

function _accidentalDisclosureBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "DISC")
)), "#1a9a5c", "Percent of breaches caused by accidents")
)}

function _portableDeviceLossBreachesBarChart(yearPercentsBarChart,prcYearsDomain,prcPercentOfNonHealthcareBreachesInYearForMethodType){return(
yearPercentsBarChart(prcYearsDomain, (year => (
  prcPercentOfNonHealthcareBreachesInYearForMethodType(year, "PORT")
)), "#1a9a5c", "Percent of breaches caused by device loss")
)}

function _hibpYearsDomain(d3){return(
d3.range(2011, 2021 + 1)
)}

function _yearOfHIBPBreachAsInt(d3)
{
  const breachYearParser = d3.timeParse("%Y-%m-%d")
  return (breach => breachYearParser(breach["BreachDate"]).getFullYear())
}


function _percentOfHIBPBreachesMatching(hibpBreaches,yearOfHIBPBreachAsInt){return(
function percentOfHIBPBreachesMatching(predicate, year) {
  const totalBreachesInYear = hibpBreaches.filter(breach => ((yearOfHIBPBreachAsInt(breach) == year)))
  const matchingBreachesInYear = totalBreachesInYear.filter(predicate)
  return (parseFloat(matchingBreachesInYear.length) / parseFloat(totalBreachesInYear.length))
}
)}

function _namesBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Names") > 0), year)
)), "#603dde", "Percent of breaches containing full names")
)}

function _phoneNumbersBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Phone numbers") > 0), year)
)), "#603dde", "Percent of breaches containing phone numbers")
)}

function _homeAddressesBarChart(yearPercentsBarChart,hibpYearsDomain,percentOfHIBPBreachesMatching){return(
yearPercentsBarChart(hibpYearsDomain, (year => (
  percentOfHIBPBreachesMatching(breach => (breach.DataClasses.indexOf("Physical addresses") > 0), year)
)), "#603dde", "Percent of breaches containing home addresses")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Have I Been Pwned — All Breaches.json", {url: new URL("./files/fd3adfd0a04f8a8178e7f7d86d22dfbc12660ca95dd98155ce0bd51fc93291ae8a8f470d86889d0dbe688537ca125fda3069e6a465e0526e9c93a13fdf7561cd", import.meta.url), mimeType: "application/json", toString}],
    ["Privacy Rights Clearinghouse Data Breach Database.csv", {url: new URL("./files/f5696edc6cfb75d25c12c88410c2075c098bda86b8e9f7d07b1df4bc8817670e834f75ee33269215863e9501a5e03a7fe75a0db1da7bca2b2029defb747beef4", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("hibpBreaches")).define("hibpBreaches", ["FileAttachment"], _hibpBreaches);
  main.variable(observer("marketItems")).define("marketItems", _marketItems);
  main.variable(observer("combinedProfileItem")).define("combinedProfileItem", ["marketItems"], _combinedProfileItem);
  main.variable(observer("combinedProfileItemIndex")).define("combinedProfileItemIndex", ["marketItems"], _combinedProfileItemIndex);
  main.variable(observer("viewof combineButtonWasClicked")).define("viewof combineButtonWasClicked", ["Inputs"], _combineButtonWasClicked);
  main.variable(observer("combineButtonWasClicked")).define("combineButtonWasClicked", ["Generators", "viewof combineButtonWasClicked"], (G, _) => G.input(_));
  main.variable(observer("infoPricesAnimatedChart")).define("infoPricesAnimatedChart", ["width","marketItems","combinedProfileItem","d3","combinedProfileItemIndex","combineButtonWasClicked"], _infoPricesAnimatedChart);
  main.variable(observer("prcBreaches")).define("prcBreaches", ["FileAttachment"], _prcBreaches);
  main.variable(observer("yearOfPRCBreachAsInt")).define("yearOfPRCBreachAsInt", ["d3"], _yearOfPRCBreachAsInt);
  main.variable(observer("prcYearsDomain")).define("prcYearsDomain", ["d3"], _prcYearsDomain);
  main.variable(observer("organizationTypeCodes")).define("organizationTypeCodes", _organizationTypeCodes);
  main.variable(observer("prcBreachesInYearForOrganizationType")).define("prcBreachesInYearForOrganizationType", ["prcBreaches","yearOfPRCBreachAsInt"], _prcBreachesInYearForOrganizationType);
  main.variable(observer("organizationTypeLines")).define("organizationTypeLines", ["organizationTypes","organizationTypeCodes","prcYearsDomain","relativeNumberOfBreaches"], _organizationTypeLines);
  main.variable(observer("organizationTypes")).define("organizationTypes", ["organizationTypeCodes"], _organizationTypes);
  main.variable(observer("relativeNumberOfBreaches")).define("relativeNumberOfBreaches", ["prcBreachesInYearForOrganizationType"], _relativeNumberOfBreaches);
  main.variable(observer("breachTargetsChart")).define("breachTargetsChart", ["width","d3","prcYearsDomain","organizationTypeLines","organizationTypes"], _breachTargetsChart);
  main.variable(observer("prcNonHealthcareBreachesInYear")).define("prcNonHealthcareBreachesInYear", ["prcBreaches","yearOfPRCBreachAsInt"], _prcNonHealthcareBreachesInYear);
  main.variable(observer("prcPercentOfNonHealthcareBreachesInYearForMethodType")).define("prcPercentOfNonHealthcareBreachesInYearForMethodType", ["prcBreaches","yearOfPRCBreachAsInt"], _prcPercentOfNonHealthcareBreachesInYearForMethodType);
  main.variable(observer("yearPercentsBarChart")).define("yearPercentsBarChart", ["width","d3"], _yearPercentsBarChart);
  main.variable(observer("hackBreachesBarChart")).define("hackBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _hackBreachesBarChart);
  main.variable(observer("accidentalDisclosureBreachesBarChart")).define("accidentalDisclosureBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _accidentalDisclosureBreachesBarChart);
  main.variable(observer("portableDeviceLossBreachesBarChart")).define("portableDeviceLossBreachesBarChart", ["yearPercentsBarChart","prcYearsDomain","prcPercentOfNonHealthcareBreachesInYearForMethodType"], _portableDeviceLossBreachesBarChart);
  main.variable(observer("hibpYearsDomain")).define("hibpYearsDomain", ["d3"], _hibpYearsDomain);
  main.variable(observer("yearOfHIBPBreachAsInt")).define("yearOfHIBPBreachAsInt", ["d3"], _yearOfHIBPBreachAsInt);
  main.variable(observer("percentOfHIBPBreachesMatching")).define("percentOfHIBPBreachesMatching", ["hibpBreaches","yearOfHIBPBreachAsInt"], _percentOfHIBPBreachesMatching);
  main.variable(observer("namesBarChart")).define("namesBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _namesBarChart);
  main.variable(observer("phoneNumbersBarChart")).define("phoneNumbersBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _phoneNumbersBarChart);
  main.variable(observer("homeAddressesBarChart")).define("homeAddressesBarChart", ["yearPercentsBarChart","hibpYearsDomain","percentOfHIBPBreachesMatching"], _homeAddressesBarChart);
  return main;
}
