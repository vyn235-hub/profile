/* ============================================================
   TRAVEL PORTFOLIO - JavaScript thuần
   4 chức năng chính:
   1. Menu mobile (mở / đóng menu trên điện thoại)
   2. Dark mode (đổi giao diện sáng / tối)
   3. Kiểm tra dữ liệu form liên hệ
   4. Nút quay lại đầu trang
   Tất cả dùng DOM + Event Listener, không dùng thư viện ngoài.
   ============================================================ */

// Lấy các phần tử cần dùng từ HTML
const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const contactForm = document.getElementById("contact-form");
const navLinks = document.querySelectorAll(".nav-link");

/* ---------------------------------------------------------
   1. MENU MOBILE: bấm nút 3 gạch để mở / đóng menu
   --------------------------------------------------------- */
function toggleMenu() {
  const isOpen = navbar.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);

  // Cập nhật thuộc tính cho trình đọc màn hình
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng");
}

menuToggle.addEventListener("click", toggleMenu);

// Bấm vào một mục menu thì tự đóng menu trên điện thoại
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navbar.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Bấm ra ngoài vùng menu thì đóng menu
document.addEventListener("click", function (event) {
  if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
    navbar.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------------------------------------------------------
   2. DARK MODE: đổi giao diện sáng <-> tối
   --------------------------------------------------------- */
const root = document.documentElement;

// Lấy giao diện đã lưu trước đó (nếu có) khi vào trang
const savedTheme = localStorage.getItem("travel-portfolio-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
  themeToggle.setAttribute("aria-pressed", "true");
}

themeToggle.addEventListener("click", function () {
  const isDark = root.getAttribute("data-theme") === "dark";

  if (isDark) {
    root.setAttribute("data-theme", "light");
    localStorage.setItem("travel-portfolio-theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("travel-portfolio-theme", "dark");
  }

  themeToggle.setAttribute("aria-pressed", String(!isDark));
});

/* ---------------------------------------------------------
   3. FORM VALIDATION: kiểm tra họ tên, email, nội dung
   --------------------------------------------------------- */

// Biểu thức kiểm tra định dạng email cơ bản
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Hàm hiển thị / xoá lỗi của một trường
function showError(field, message) {
  const group = field.closest(".form-group");
  const errorBox = document.getElementById("error-" + field.id);

  group.classList.add("has-error");
  errorBox.textContent = message;
}

function clearError(field) {
  const group = field.closest(".form-group");
  const errorBox = document.getElementById("error-" + field.id);

  group.classList.remove("has-error");
  errorBox.textContent = "";
}

contactForm.addEventListener("submit", function (event) {
  // Ngăn trình duyệt tải lại trang
  event.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const status = document.getElementById("form-status");

  let isValid = true;

  // 1) Họ tên: bắt buộc và tối thiểu 2 ký tự
  if (name.value.trim() === "") {
    showError(name, "Vui lòng nhập họ tên của bạn.");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError(name, "Họ tên phải có ít nhất 2 ký tự.");
    isValid = false;
  } else {
    clearError(name);
  }

  // 2) Email: bắt buộc và đúng định dạng
  if (email.value.trim() === "") {
    showError(email, "Vui lòng nhập email của bạn.");
    isValid = false;
  } else if (!emailPattern.test(email.value.trim())) {
    showError(email, "Email không hợp lệ. Ví dụ: ten@email.com");
    isValid = false;
  } else {
    clearError(email);
  }

  // 3) Nội dung: bắt buộc và tối thiểu 10 ký tự
  if (message.value.trim() === "") {
    showError(message, "Vui lòng nhập nội dung lời nhắn.");
    isValid = false;
  } else if (message.value.trim().length < 10) {
    showError(message, "Nội dung lời nhắn quá ngắn (tối thiểu 10 ký tự).");
    isValid = false;
  } else {
    clearError(message);
  }

  // Hiển thị thông báo kết quả
  status.classList.add("show");

  if (isValid) {
    // Website chưa có máy chủ (backend) nên không gửi email thật.
    // Chỉ thông báo cho người dùng biết dữ liệu đã hợp lệ.
    status.className = "form-status show success";
    status.textContent =
      "Dữ liệu hợp lệ. Hiện website chưa có backend nên lời nhắn chưa được gửi đi. Bạn vui lòng liên hệ trực tiếp qua email hoặc điện thoại ở mục Liên hệ.";

    contactForm.reset();
  } else {
    status.className = "form-status show fail";
    status.textContent = "Vui lòng kiểm tra lại các ô được đánh dấu đỏ bên trên.";
  }
});

// Xoá lỗi ngay khi người dùng sửa lại trường
["name", "email", "message"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", function () {
    clearError(this);
  });
});

/* ---------------------------------------------------------
   4. NÚT QUAY LẠI ĐẦU TRANG + THEO DÕI MENU ĐANG active
   --------------------------------------------------------- */
window.addEventListener("scroll", function () {
  // Hiện nút quay lại đầu trang khi cuộn xuống 400px
  backToTop.classList.toggle("show", window.scrollY > 400);

  // Đánh dấu mục menu tương ứng với section đang xem
  let currentId = "";
  document.querySelectorAll("section[id]").forEach(function (section) {
    if (window.scrollY >= section.offsetTop - 120) {
      currentId = section.id;
    }
  });

  navLinks.forEach(function (link) {
    link.classList.toggle("is-active", link.getAttribute("href") === "#" + currentId);
  });
});

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------------------------------------------------------
   5. HIỂN THỊ NĂM HIỆN TẠI Ở CHÂN TRANG
   --------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
