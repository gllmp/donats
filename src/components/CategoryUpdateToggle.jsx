import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import { resolve } from 'path/posix';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  
  // console.log(props);
  
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      // checked={props.checked}
      // value={Boolean(!props.checked)}
      {...props}
    />
  );
});

function TogglesList(props) {
  const categoryToggleRef = props.categoryToggleRef;
  const categories = categoryToggleRef.state.categories;

  // console.log(categoryToggleRef.state.toggleList)

  const categoriesToggles = categories.map((category) =>
    <FormGroup row className="swiper-slide category-switch-toggle" key={category.name.toString()}>
      <FormControlLabel
        control={
          <IOSSwitch 
            name={category.name}
            checked = {categoryToggleRef.state.toggleList[category.name]}
            onChange={categoryToggleRef.handleToggle}
            color="primary"
            disabled={false}
            // test={props.toggleState[category.name]}
          />
        }
        label={category.name}
      />
    </FormGroup>
  );

  return categoriesToggles;
}

class CategoryUpdateToggle extends React.Component {
  constructor(props) {
    super(props);

    console.log(props)

    this.state = {
      categories: props.categories,
      selectedCategory: props.selectedCategory,
      // toggleList: {AUTOPROMO: false,
      //   CULTURA: true,
      //   CURIOSITY: false,
      //   DEUSPI: false,
      //   DOCUMENTAIRE: false,
      //   MUSIC: false,
      //   PROMO: false,
      //   RADIOVISION: false,
      //   RAP: false,
      //   SKATE: false
      // },
      toggleList: props.toggleList,
      swiper: null
    };
            
    this.params = {
      // slidesPerView: 3,
      spaceBetween: 0,
      speed: 300,
      initialSlide: 1,
      centeredSlides: true,
      prevenClicks: false,
      preventClicksPropagation: true,
      slideToClickedSlide: false,
      //loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
        dynamicBullets: true
      },
      breakpoints: {
        1024: {
          slidesPerView: 3,
        },
        // 768: {
        //   slidesPerView: 4,
        //   spaceBetween: 30
        // },
        // 640: {
        //   slidesPerView: 4,
        //   spaceBetween: 20
        // },
        320: {
          slidesPerView: 1,
          // spaceBetween: 10
        }
      },
      // on: {
      //   init: () => {
      //     //console.log("INIT SWIPER");
      //   },
      //   click: (event) => {

      //   }
      // }      
    }

    this.handleToggle = this.handleToggle.bind(this);
    this.updateSwiper = this.updateSwiper.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  handleToggle(event) {
    let toggleName = event.target.name;
    let toggleStateDuplicate = this.state.toggleList;

    // event.target.value = event.target.checked;
    let value = Boolean(event.target.checked);

    // console.log("NAME: ", event.target.name);
    // console.log("VALUE: ", event.target.value);
    // console.log("CHECKED: ", event.target.checked);

    new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      Object.keys(toggleStateDuplicate).forEach(category => {
        if (toggleName === category) {
          toggleStateDuplicate[category] = !toggleStateDuplicate[category];
        }
      });
    }).then(() => {
      this.setState({
        toggleList: toggleStateDuplicate
      });

      // this.setState({
      //   toggleList: value
      // });

      //console.log("CATEGORY TOGGLE: ", this.state.toggleList);
    }).catch((error) => {
        console.error(error);
    }).finally(() => {
      
    });
  }

  updateSwiper(swiper) {
    this.setState({ swiper });
  }

  render() {
    // const { toggleList } = this.state;

    return (
      <Swiper getSwiper={this.updateSwiper} {...this.params} >
        <TogglesList categoryToggleRef={this} />
      </Swiper>
    )
  }
};

export default CategoryUpdateToggle;