import React, { useState, useEffect, useRef } from "react";

const SlideShow = ({ btnTextRef_3, btnTextRef_4 }) => {
  const [slideIndex, setSlideIndex] = useState(1);
  const [srText, setSrText] = useState();
  const slideRef = useRef(null);

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  const plusSlides = (n) => {
    setSlideIndex(slideIndex + n);
  };

  const showSlides = (n) => {
    let slides = document.getElementsByClassName("mySlides");

    if (n > slides.length) {
      setSlideIndex(1);
    } else if (n < 1) {
      setSlideIndex(slides.length);
    }

    for (let i = 0; i < slides.length; i++) {
      if (slideIndex !== 0) {
        slides[i].style.display = "none";
      }
    }

    if (slideIndex >= 1 && slideIndex <= slides.length) {
      slides[slideIndex - 1].style.display = "block";
    }

    if (slideIndex === 1) {
      slideRef.current.classList.remove("slide-3");
      slideRef.current.classList.remove("slide-2");
      slideRef.current.classList.add("slide-1");

      setSrText("Woman painting on a mural wall"); // solution for alt text
    } else if (slideIndex === 2) {
      slideRef.current.classList.remove("slide-1");
      slideRef.current.classList.remove("slide-3");
      slideRef.current.classList.add("slide-2");

      setSrText("Man painting by the ocean");
    } else if (slideIndex === 3) {
      slideRef.current.classList.remove("slide-2");
      slideRef.current.classList.remove("slide-1");
      slideRef.current.classList.add("slide-3");

      setSrText("Woman painting a house in her garden");
    }
  };

  return (
    <section ref={slideRef} className="slideshow-container">
      <section className="mySlides">
        <p className="sr-only">{srText}</p>
        <section className="numbertext">
          <span className="slide-number">1 / 3</span>
        </section>
        <section className="slideshow-box">
          <h1 className="slideshow-caption">Paint With Class</h1>
          <p className="slideshow-text">
            Formal concerns establishment biomorphic token a vague whole the
            actuality of dialectics the work is an. Ontological nature of
            nonspatial space phenomenology artistic production suggestive but
            never didactic unpacked antieconomical. In reference to the
            political expectations while also place making imbricates.
          </p>
        </section>
      </section>

      <section className="mySlides">
        <p className="sr-only">{srText}</p>
        <section className="numbertext">
          <span className="slide-number">2 / 3</span>
        </section>
        <section className="slideshow-box">
          <h1 className="slideshow-caption">Paint With Class</h1>
          <p className="slideshow-text">
            Suggestive but never didactic reality ontological metadata a level
            of artifice perception of. The gallery assemblage spatial space
            social simultaneously nonspatial. Oeuvre alien trompe l'oeil
            antieconomical autonomy is encoded onto aporia of establishment it
            subversively inverts of the built environment resembles
            anti-structural.
          </p>
        </section>
      </section>

      <section className="mySlides">
        <p className="sr-only">{srText}</p>
        <section className="numbertext">
          <span className="slide-number">3 / 3</span>
        </section>
        <section className="slideshow-box">
          <h1 className="slideshow-caption">Paint With Class</h1>
          <p className="slideshow-text">
            Arte Povera subverts expressively punctum painted through the
            virtual inescapability artist-run fantasy the work is a reality
            jump-cut. Metadata incorporating material elements grawlix
            conditions of possibility expectations lexical hermeticism.
            Reification virtual inescapability abstraction corpus biopolitical
            the political.
          </p>
        </section>
      </section>

      <button className="prev" onClick={() => plusSlides(-1)}>
        &#10094; <span ref={btnTextRef_3}>Previous Slide</span>
      </button>
      <button className="next" onClick={() => plusSlides(1)}>
        <span ref={btnTextRef_4}>Next Slide</span> &#10095;
      </button>

      <section className="mx-auto text-center">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`mx-0.5 inline-block size-[15px] rounded-full transition-colors duration-[600ms] ease-in-out ${
              slideIndex === n ? "bg-button" : "bg-[#bbb]"
            }`}
          ></span>
        ))}
      </section>
    </section>
  );
};

export default SlideShow;
