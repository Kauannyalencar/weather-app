

const icons = [
    {
        name: "clear-day",
        src: ""
    },
    {
        name: "clear-night",
        src: ""
    },
    {
        name: "cloudy",
        src: ""
    },
    {
        name: "fog",
        src: ""
    }, {
        name: "moon-full",
        src: ""
    },
    {
        name: "rain",
        src: ""
    },
    {
        name: "partly-cloudy-day",
        src: ""
    },
    {
        name: "partly-cloudy-night",
        src: ""
    },
    {
        name: "snow",
        src: ""
    },
    {
        name: "thunder-rain",
        src: ""
    },
    {
        name: "uvIndex",
        src: ""
    },
    {
        name: "wind",
        src: '',
    }

]

const imagesContext = require.context('../assets/img', true, /\.svg$/);
const images = imagesContext.keys().map(imagesContext);

images.map((icon, index) => {
    icons[index].src = icon
    
})
console.log(icons);


export default icons;