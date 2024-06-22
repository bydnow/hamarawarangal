(function ($) {
    "use strict";
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.header').addClass('header-sticky');
        } else {
            $('.header').removeClass('header-sticky');
        }
    });
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 768) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        // Fetch and display news on page load
        fetchNews();
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    // Category News Slider
    $('.cn-slider').slick({
        autoplay: false,
        infinite: true,
        dots: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // Fetch news data
    const apiKey = 'c11030d5541b419eae9fb49fba4dceeb';
    const newsContainer = $('#news-container');

    async function fetchNews() {
        try {
            const response = await fetch(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    }

    // Display news data
    function displayNews(articles) {
        newsContainer.empty();
        articles.forEach(article => {
            const newsArticle = $(`
                <div class="news-article">
                    <h2>${article.title}</h2>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                </div>
            `);
            newsContainer.append(newsArticle);
        });
    }
})(jQuery);


// document.addEventListener('DOMContentLoaded', function() {
//     const andhraDropdown = document.getElementById('andhraDropdown');
//     const telanganaDropdown = document.getElementById('telanganaDropdown');

//     const andhraDistricts = [
//         "Anantapur",
//         "Chittoor",
//         "East Godavari",
//         "Guntur",
//         "Kadapa",
//         "Krishna",
//         "Kurnool",
//         "Nellore",
//         "Prakasam",
//         "Srikakulam",
//         "Visakhapatnam",
//         "Vizianagaram",
//         "West Godavari"
//     ];

//     const telanganaDistricts = [
//         "Adilabad",
//         "Hyderabad",
//         "Karimnagar",
//         "Khammam",
//         "Mahabubnagar",
//         "Medak",
//         "Nalgonda",
//         "Nizamabad",
//         "Rangareddy",
//         "Warangal"
//     ];

//     andhraDistricts.forEach(district => {
//         const li = document.createElement('li');
//         const a = document.createElement('a');
//         a.href = "#"; // You can update this with the actual link if needed
//         a.textContent = district;
//         li.appendChild(a);
//         andhraDropdown.appendChild(li);
//     });

//     telanganaDistricts.forEach(district => {
//         const li = document.createElement('li');
//         const a = document.createElement('a');
//         a.href = "#"; // You can update this with the actual link if needed
//         a.textContent = district;
//         li.appendChild(a);
//         telanganaDropdown.appendChild(li);
//     });
// });
function fetchNews(districtId) {
    let newsContent = document.getElementById('news-content');
    newsContent.innerHTML = `<h3>News for ${districtId.replace('-', ' ')}</h3><p>Loading news...</p>`;
    
    $.ajax({
        url: `/get-news?district=${districtId}`,
        method: 'GET',
        success: function(data) {
            let newsHtml = `<h3>News for ${districtId.replace('-', ' ')}</h3><ul>`;
            data.forEach(article => {
                newsHtml += `<li>${article}</li>`;
            });
            newsHtml += `</ul>`;
            newsContent.innerHTML = newsHtml;
        },
        error: function(error) {
            newsContent.innerHTML = `<p>Error fetching news. Please try again later.</p>`;
        }
    });
}

async function fetchLatestNews() {
    const districts = ['adilabad', 'hyderabad', 'karimnagar', 'khammam', 'mahabubnagar', 'medak', 'nalgonda', 'nizamabad', 'rangareddy', 'warangal'];
    const apiKey = 'c11030d5541b419eae9fb49fba4dceeb'; // Replace with your actual API key
    const apiUrl = 'https://newsapi.org/v2/everything';
    const newsContainer = document.getElementById('latest-news-content');
    newsContainer.innerHTML = ''; // Clear previous news

    try {
        for (const district of districts) {
            const response = await fetch(`${apiUrl}?q=${district}&apiKey=${apiKey}`);
            const newsData = await response.json();

            newsData.articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('col-md-4');
                newsItem.innerHTML = `
                    <div class="news-item">
                        <div class="news-img">
                            <img src="${article.urlToImage || 'img/default-news.jpg'}" alt="News Image">
                        </div>
                        <div class="news-details">
                            <h3 class="news-title">${article.title}</h3>
                            <p class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</p>
                            <p class="news-description">${article.description}</p>
                            <a href="${article.url}" target="_blank" class="read-more">Read More</a>
                        </div>
                    </div>
                `;
                newsContainer.appendChild(newsItem);
            });
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Call fetchLatestNews when the page loads
document.addEventListener('DOMContentLoaded', fetchLatestNews);
