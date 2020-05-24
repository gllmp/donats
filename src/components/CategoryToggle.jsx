import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

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
      {...props}
    />
  );
});

function TogglesList(props) {
  const categoryToggleRef = props.categoryToggleRef;
  const categories = categoryToggleRef.state.categories;
  
  const categoriesToggles = categories.map((category) =>
    <FormGroup row className="swiper-slide category-switch-toggle" key={category.name.toString()}>
      <FormControlLabel
        control={
          <IOSSwitch 
            name={category.name}
            //checked={categoryToggleRef.state.togglesChecked[category.name]}
            checked={categoryToggleRef.state.checked}
            onChange={categoryToggleRef.handleToggle}
            color="primary"
          />
        }
        label={category.name}
      />
    </FormGroup>
  );

  return categoriesToggles;
}

class CategoryToggle extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        categories: props.categories,
        togglesChecked: [],
        swiper: null
      };
              
      this.params = {
        slidesPerView: 3,
        spaceBetween: 30,
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
        // breakpoints: {
        //   1024: {
        //     slidesPerView: 4,
        //     spaceBetween: 40
        //   },
        //   768: {
        //     slidesPerView: 4,
        //     spaceBetween: 30
        //   },
        //   640: {
        //     slidesPerView: 4,
        //     spaceBetween: 20
        //   },
        //   320: {
        //     slidesPerView: 4,
        //     spaceBetween: 10
        //   }
        // },
        // on: {
        //   init: () => {
        //     //console.log("INIT SWIPER");
        //   },
        //   click: (event) => {

        //   }
        // }      
      }

      this.initiateToggleList = this.initiateToggleList.bind(this);
      this.handleToggle = this.handleToggle.bind(this);
      this.updateSwiper = this.updateSwiper.bind(this);
    }

    componentDidMount() {
      this.initiateToggleList();      
    }

    componentWillUnmount() {

    }

    initiateToggleList() {
      let togglesCheckedArray = [];

      // set category toggles unchecked by default
      this.state.categories.forEach(category => {
        togglesCheckedArray[category.name] = false;
      });

      this.setState({
        togglesChecked: togglesCheckedArray
      });
    }

    handleToggle(event) {
      let toggleName = event.target.name;
      let toggleStateDuplicate = this.state.togglesChecked;

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
          togglesChecked: toggleStateDuplicate
        });

        console.log("CATEGORY TOGGLE: ", this.state.togglesChecked);
      }).catch((error) => {
          console.error(error);
      }).finally(() => {
        
      });    
    }

    updateSwiper(swiper) {
      this.setState({ swiper });
    }

    render() {

      return (
        <Swiper getSwiper={this.updateSwiper} {...this.params} >
            <TogglesList categoryToggleRef={this} />
        </Swiper>
      )
    }
  };

export default CategoryToggle;