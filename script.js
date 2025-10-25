const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const navMenu = document.querySelector(".nav-menu")

mobileMenuToggle.addEventListener("click", () => {
  mobileMenuToggle.classList.toggle("active")
  navMenu.classList.toggle("active")
})

const linksToCloseMenu = document.querySelectorAll(".nav-link, .mobile-phone, .mobile-social a")

linksToCloseMenu.forEach((link) => {
  link.addEventListener("click", () => {
  
    mobileMenuToggle.classList.remove("active")
    navMenu.classList.remove("active")
  })
})


window.addEventListener("load", () => {
  let current = ""
  const sections = document.querySelectorAll("section[id]")

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute("id")
    }
  })

  const navLinks = document.querySelectorAll(".nav-link") 
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

const comparisonContainer = document.querySelector(".comparison-container")
const comparisonHandle = document.querySelector(".comparison-handle")
const comparisonAfter = document.querySelector(".comparison-after")

let isDragging = false

function updateComparison(x) {
  if (!comparisonContainer) return 

  const containerRect = comparisonContainer.getBoundingClientRect()
  const containerWidth = containerRect.width
  const offsetX = x - containerRect.left
  const percentage = Math.max(0, Math.min(100, (offsetX / containerWidth) * 100))

  comparisonHandle.style.left = `${percentage}%`

  comparisonAfter.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`
}

comparisonHandle.addEventListener("mousedown", (e) => {
  e.preventDefault() 
  isDragging = true
  comparisonContainer.classList.add("dragging")
})

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    updateComparison(e.clientX)
  }
})

document.addEventListener("mouseup", () => {
  isDragging = false
  comparisonContainer.classList.remove("dragging")
})


comparisonHandle.addEventListener("touchstart", (e) => {
  e.preventDefault()
  isDragging = true
  comparisonContainer.classList.add("dragging")
})

document.addEventListener("touchmove", (e) => {
  if (isDragging && e.touches.length > 0) {
    updateComparison(e.touches[0].clientX)
  }
})

document.addEventListener("touchend", () => {
  isDragging = false
  comparisonContainer.classList.remove("dragging")
})


const galleryVideos = document.querySelectorAll(".gallery-video")

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target
      if (entry.isIntersecting) {
        video.play().catch((error) => {
          console.log("[v0] Video autoplay prevented:", error)
        })
      } else {
        video.pause()
      }
    })
  },
  {
    threshold: 0.5,
  },
)

galleryVideos.forEach((video) => {
  videoObserver.observe(video)
})

const galleryItems = document.querySelectorAll(".gallery-item")
const galleryModal = document.getElementById("galleryModal")
const modalImage = document.getElementById("modalImage")
const modalVideo = document.getElementById("modalVideo")
const modalClose = document.querySelector(".modal-close")
const modalPrev = document.querySelector(".modal-prev")
const modalNext = document.querySelector(".modal-next")
const modalCounter = document.getElementById("modalCounter")
const totalItems = 3

let currentIndex = 0

function openModal(index) {
  currentIndex = index
  updateModalContent()
  galleryModal.classList.add("active")
  document.body.style.overflow = "hidden" 
}

function closeModal() {
  galleryModal.classList.remove("active")
  document.body.style.overflow = ""

  modalVideo.pause()
  modalVideo.style.display = "none"
  modalImage.style.display = "none"
}

function updateModalContent() {

  if (currentIndex < 0 || currentIndex >= galleryItems.length) return

  const item = galleryItems[currentIndex]
  const type = item.getAttribute("data-type")


  modalImage.style.display = "none"
  modalVideo.style.display = "none"
  modalVideo.pause() 

  if (type === "video") {
    const videoSource = item.querySelector("source")
      ? item.querySelector("source").src
      : item.querySelector("video").src
    modalVideo.querySelector("source").src = videoSource
    modalVideo.load() 
    modalVideo.style.display = "block"
    modalVideo.play().catch((e) => console.log("Modal video play error:", e))
  } else {
    const img = item.querySelector("img")
    modalImage.src = img.src
    modalImage.alt = img.alt
    modalImage.style.display = "block"
  }

  modalCounter.textContent = `${currentIndex + 1} / ${totalItems}`
}

function showPrev() {
  currentIndex = (currentIndex - 1 + totalItems) % totalItems
  updateModalContent()
}

function showNext() {
  currentIndex = (currentIndex + 1) % totalItems
  updateModalContent()
}


galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openModal(index)
  })
})


modalClose.addEventListener("click", closeModal)
modalPrev.addEventListener("click", showPrev)
modalNext.addEventListener("click", showNext)


document.addEventListener("keydown", (e) => {
  if (!galleryModal.classList.contains("active")) return

  if (e.key === "Escape") closeModal()
  if (e.key === "ArrowLeft") showPrev()
  if (e.key === "ArrowRight") showNext()
})


galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    closeModal()
  }
})

const observerOptions = {
  threshold: 0.15, 
  rootMargin: "0px 0px -80px 0px",
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)


document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach((el) => {
  revealObserver.observe(el)
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && href.length > 1) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const offsetTop = target.offsetTop - 80 
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    }
  })
})