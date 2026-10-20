import React, { useState, useEffect, useRef } from "react";
import "../App.css";

function Settings({
  isBoxVisible,
  toggleBoxVisibility,
  handleCloseButtonClick,
}) {
  const [isChecked, setIsChecked] = useState(null);
  const [isClickDisabled, setClickDisabled] = useState(false);
  const [alertText, setAlertText] = useState();
  const [isTabDisabled, setIsTabDisabled] = useState(false);

  const overlayRef = useRef(null);
  const contrastRef = useRef(null);
  const settingsRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const containerRef = useRef(null);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setIsChecked(value);
  };

  const resetSettings = () => {
    setIsChecked(null);
    setIsTabDisabled(false);
  };

  const getSettingsFocusables = () => {
    const controls = containerRef.current?.querySelectorAll(
      'button, input[type="radio"]',
    );
    const focusables = [];
    let radioAdded = false;

    controls?.forEach((control) => {
      if (control.type !== "radio") {
        focusables.push(control);
      } else if (control.checked || (!radioAdded && !isChecked)) {
        focusables.push(control);
        radioAdded = true;
      }
    });

    return focusables;
  };

  const handleKeyPress = (event) => {
    if (event.key !== "Tab" || !isTabDisabled) return;

    event.preventDefault();

    const focusables = getSettingsFocusables();
    if (focusables.length === 0) return;

    const currentIndex = focusables.indexOf(document.activeElement);
    const step = event.shiftKey ? -1 : 1;
    const nextIndex =
      currentIndex === -1
        ? event.shiftKey
          ? focusables.length - 1
          : 0
        : (currentIndex + step + focusables.length) % focusables.length;

    focusables[nextIndex].focus();
  };

  useEffect(() => {
    if (!isBoxVisible) return;

    const handleOutsideClick = (event) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target)
      ) {
        handleCloseButtonClick();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isBoxVisible, handleCloseButtonClick]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isTabDisabled]);

  useEffect(() => {
    if (isChecked === "Mouse") {
      overlayRef.current.classList.add("disable-click");
      contrastRef.current.classList.remove("overlay");

      setAlertText("Mouse click is disabled");
      setClickDisabled(true);
      setIsTabDisabled(false);
    } else if (isChecked === "ColorContrast") {
      contrastRef.current.classList.add("overlay");
      overlayRef.current.classList.remove("disable-click");
      setIsTabDisabled(false);

      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("img-size");
      document.body.classList.remove("change-font-size");
      document.body.classList.remove("hide-btn-text");

      setAlertText("Color contrast has been decreased");
    } else if (isChecked === "FontSize") {
      overlayRef.current.classList.remove("disable-click");
      contrastRef.current.classList.remove("overlay");
      setIsTabDisabled(false);

      document.body.classList.remove("img-size");
      document.body.classList.add("change-font-size");
      document.body.classList.remove("hide-btn-text");
      window.removeEventListener("keydown", handleKeyPress);

      setAlertText("Font size has been decreased");
    } else if (isChecked === "HideButtonText") {
      overlayRef.current.classList.remove("disable-click");
      contrastRef.current.classList.remove("overlay");
      setIsTabDisabled(false);

      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("img-size");
      document.body.classList.add("hide-btn-text");
      document.body.classList.remove("change-font-size");

      setAlertText("Button text is hidden");
    } else if (isChecked === "imgSize") {
      document.body.classList.add("img-size");
      overlayRef.current.classList.remove("disable-click");
      contrastRef.current.classList.remove("overlay");
      setIsTabDisabled(false);

      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.add("hide-btn-text");
      document.body.classList.remove("change-font-size");

      setAlertText("Image size has been decreased");
    } else if (isChecked === "Keyboard") {
      overlayRef.current.classList.remove("disable-click");
      contrastRef.current.classList.remove("overlay");

      document.body.classList.remove("img-size");
      document.body.classList.remove("change-font-size");
      document.body.classList.remove("hide-btn-text");

      window.removeEventListener("keydown", handleKeyPress);
      document.body.classList.remove("img-size");
      document.body.classList.remove("change-font-size");
      document.body.classList.remove("hide-btn-text");

      setIsTabDisabled(true);

      setAlertText("Keyboard navigation is disabled");
    } else {
      overlayRef.current.classList.remove("disable-click");
      contrastRef.current.classList.remove("overlay");

      document.body.classList.remove("img-size");
      document.body.classList.remove("hide-btn-text");
      document.body.classList.remove("change-font-size");
      setIsTabDisabled(false);
      window.removeEventListener("keydown", handleKeyPress);

      setAlertText("");
      setClickDisabled(false);
    }
  }, [isChecked]);

  return (
    <div ref={containerRef}>
      <span className="alert-text">
        <strong>{alertText}</strong>
      </span>
      <div
        ref={overlayRef}
        className={`${isChecked ? "disable-click" : ""}`}
      ></div>
      <div
        ref={contrastRef}
        className={`${isChecked ? "change-contrast" : ""}`}
      ></div>

      <div className="btn-container">
        <button
          ref={settingsButtonRef}
          className="header-btn accessibility-btn accessibility"
          onClick={() => toggleBoxVisibility("accessibility")}
        >
          <img
            src="icons/gear-solid.svg"
            alt="Gear"
            className="icon accessibility"
          ></img>{" "}
          Accessibility Settings
        </button>
      </div>

      {isBoxVisible && (
        <div ref={settingsRef} className="settings-box pop-up">
          <div className="flex-container">
            <button className="reset-btn settings-btn" onClick={resetSettings}>
              <img
                src="icons/rotate-left-solid.svg"
                alt="Reverse"
                className="icon"
              ></img>{" "}
              Reset Settings
            </button>

            <button
              className="close-btn settings-btn"
              onClick={handleCloseButtonClick}
            >
              <img
                src="icons/xmark-solid.svg"
                alt="X Mark"
                className="icon"
              ></img>{" "}
              Close Settings
            </button>
          </div>

          <br />
          <label className="radio-container">
            <span className="radio-label">Hide button text</span>
            <input
              type="radio"
              id="hideButtonText"
              name="setting"
              value="HideButtonText"
              checked={isChecked === "HideButtonText"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
          <hr />

          <label className="radio-container">
            <span className="radio-label">Decrease font size</span>
            <input
              type="radio"
              id="fontSize"
              name="setting"
              value="FontSize"
              checked={isChecked === "FontSize"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
          <hr />

          <label className="radio-container">
            <span className="radio-label">Decrease image size</span>
            <input
              type="radio"
              id="imgSize"
              name="setting"
              value="imgSize"
              checked={isChecked === "imgSize"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
          <hr />

          <label className="radio-container">
            <span className="radio-label">Decrease color contrast</span>
            <input
              type="radio"
              id="colorContrast"
              name="setting"
              value="ColorContrast"
              checked={isChecked === "ColorContrast"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
          <hr />

          <label className="radio-container">
            <span className="radio-label">Disable mouse click</span>
            <input
              type="radio"
              id="mouse"
              name="setting"
              value="Mouse"
              checked={isChecked === "Mouse"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
          <hr />
          <label className="radio-container">
            <span className="radio-label">Disable keyboard navigation</span>
            <input
              type="radio"
              id="keyboard"
              name="setting"
              value="Keyboard"
              checked={isChecked === "Keyboard"}
              onChange={handleRadioChange}
            ></input>
            <span className="custom-radio"></span>
          </label>
        </div>
      )}
    </div>
  );
}

export default Settings;
