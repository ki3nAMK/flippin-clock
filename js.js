const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 30);

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector(".segment-display");
  const segmentDisplayTop = segmentDisplay.querySelector(
    ".segment-display__top"
  );
  const segmentDisplayBottom = segmentDisplay.querySelector(
    ".segment-display__bottom"
  );

  const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");
  const segmentOverlayTop = segmentOverlay.querySelector(
    ".segment-overlay__top"
  );
  const segmentOverlayBottom = segmentOverlay.querySelector(
    ".segment-overlay__bottom"
  );

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(displayElement, overlayElement, value) {
  let renderValue = value;
  if (value < 10) renderValue = "0" + value;
  displayElement.textContent = renderValue;
  overlayElement.textContent = renderValue;
}

function updateTimeSegment(segmentElement, timeValue) {
  const segmentElements = getTimeSegmentElements(segmentElement);

  if (
    parseInt(segmentElements.segmentDisplayTop.textContent, 10) === timeValue
  ) {
    return;
  }

  segmentElements.segmentOverlay.classList.add("flip");

  updateSegmentValues(
    segmentElements.segmentDisplayTop,
    segmentElements.segmentOverlayBottom,
    timeValue
  );

  function finishAnimation() {
    segmentElements.segmentOverlay.classList.remove("flip");
    updateSegmentValues(
      segmentElements.segmentDisplayBottom,
      segmentElements.segmentOverlayTop,
      timeValue
    );

    this.removeEventListener("animationend", finishAnimation);
  }

  segmentElements.segmentOverlay.addEventListener(
    "animationend",
    finishAnimation
  );
}

function updateTimeSection(sectionID, timeValue) {
  const sectionElement = document.getElementById(sectionID);
  const timeSegments = sectionElement.querySelectorAll(".time-segment");

  updateTimeSegment(timeSegments[0], timeValue);
}

function getTimeRemaining(targetDateTime) {
  const nowTime = Date.now();
  const complete = nowTime >= targetDateTime;
  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0,
      weeks: 0,
    };
  }

  const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
  const weeks = Math.floor(secondsRemaining / 60 / 60 / 24 / 7);
  const days = Math.floor(secondsRemaining / 60 / 60 / 24) - weeks * 7;
  const hours =
    Math.floor(secondsRemaining / 60 / 60) - days * 24 - weeks * 7 * 24;
  const minutes =
    Math.floor(secondsRemaining / 60) -
    hours * 60 -
    (days * 24 + weeks * 7 * 24) * 60;
  const seconds = secondsRemaining % 60;

  return {
    complete,
    seconds,
    minutes,
    hours,
    days,
    weeks,
  };
}

function updateAllSegments() {
  const timeRemainingBits = getTimeRemaining(new Date(targetDate).getTime());

  updateTimeSection("seconds", timeRemainingBits.seconds);
  updateTimeSection("minutes", timeRemainingBits.minutes);
  updateTimeSection("hours", timeRemainingBits.hours);
  updateTimeSection("days", timeRemainingBits.days);
  updateTimeSection("weeks", timeRemainingBits.weeks);

  return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
  const isComplete = updateAllSegments();

  if (isComplete) {
    clearInterval(countdownTimer);
  }
}, 1000);

updateAllSegments();
