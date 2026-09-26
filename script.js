function copyText(text) {
    const url = window.location.href.split('#')[0]
    const anchorLink = url+"#"+text;
    navigator.clipboard.writeText(anchorLink);
}

function changeNavbar(open) {
    if (open) {
        document.querySelector(".bars-icon").classList.remove("block");
        document.querySelector(".bars-icon").classList.add("hidden");

        document.querySelector(".close-icon").classList.remove("hidden");
        document.querySelector(".close-icon").classList.add("block");

        document.querySelector(".dropdown-menu").classList.remove("hidden");
        document.querySelector(".dropdown-menu").classList.add("block");
        return
    }
    if (!open) {
        document.querySelector(".bars-icon").classList.remove("hidden");
        document.querySelector(".bars-icon").classList.add("block");

        document.querySelector(".close-icon").classList.remove("block");
        document.querySelector(".close-icon").classList.add("hidden");

        document.querySelector(".dropdown-menu").classList.remove("block");
        document.querySelector(".dropdown-menu").classList.add("hidden");
        return
    }
}
