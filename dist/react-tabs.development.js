(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('prop-types'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'prop-types', 'react'], factory) :
  (global = global || self, factory(global.ReactTabs = {}, global.PropTypes, global.React));
}(this, function (exports, PropTypes, React) { 'use strict';

  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
  var React__default = 'default' in React ? React['default'] : React;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function makeTypeChecker(tabsRole) {
    return function (element) {
      return !!element.type && element.type.tabsRole === tabsRole;
    };
  }

  var isTab = makeTypeChecker('Tab');
  var isTabList = makeTypeChecker('TabList');
  var isTabPanel = makeTypeChecker('TabPanel');

  function isTabChild(child) {
    return isTab(child) || isTabList(child) || isTabPanel(child);
  }

  function deepMap(children, callback) {
    return React.Children.map(children, function (child) {
      // null happens when conditionally rendering TabPanel/Tab
      // see https://github.com/reactjs/react-tabs/issues/37
      if (child === null) return null;

      if (isTabChild(child)) {
        return callback(child);
      }

      if (child.props && child.props.children && typeof child.props.children === 'object') {
        // Clone the child that has children and map them too
        return React.cloneElement(child, _objectSpread2({}, child.props, {
          children: deepMap(child.props.children, callback)
        }));
      }

      return child;
    });
  }
  function deepForEach(children, callback) {
    return React.Children.forEach(children, function (child) {
      // null happens when conditionally rendering TabPanel/Tab
      // see https://github.com/reactjs/react-tabs/issues/37
      if (child === null) return;

      if (isTab(child) || isTabPanel(child)) {
        callback(child);
      } else if (child.props && child.props.children && typeof child.props.children === 'object') {
        if (isTabList(child)) callback(child);
        deepForEach(child.props.children, callback);
      }
    });
  }

  function childrenPropType(props, propName, componentName) {
    var error;
    var tabsCount = 0;
    var panelsCount = 0;
    var tabListFound = false;
    var listTabs = [];
    var children = props[propName];
    deepForEach(children, function (child) {
      if (isTabList(child)) {
        if (child.props && child.props.children && typeof child.props.children === 'object') {
          deepForEach(child.props.children, function (listChild) {
            return listTabs.push(listChild);
          });
        }

        if (tabListFound) {
          error = new Error("Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.");
        }

        tabListFound = true;
      }

      if (isTab(child)) {
        if (!tabListFound || listTabs.indexOf(child) === -1) {
          error = new Error("Found a 'Tab' component outside of the 'TabList' component. 'Tab' components " + "have to be inside the 'TabList' component.");
        }

        tabsCount++;
      } else if (isTabPanel(child)) {
        panelsCount++;
      }
    });

    if (!error && tabsCount !== panelsCount) {
      error = new Error("There should be an equal number of 'Tab' and 'TabPanel' in `" + componentName + "`. " + ("Received " + tabsCount + " 'Tab' and " + panelsCount + " 'TabPanel'."));
    }

    return error;
  }
  function onSelectPropType(props, propName, componentName, location, propFullName) {
    var prop = props[propName];
    var name = propFullName || propName;
    var error = null;

    if (prop && typeof prop !== 'function') {
      error = new Error("Invalid " + location + " `" + name + "` of type `" + typeof prop + "` supplied " + ("to `" + componentName + "`, expected `function`."));
    } else if (props.selectedIndex != null && prop == null) {
      error = new Error("The " + location + " `" + name + "` is marked as required in `" + componentName + "`, but " + "its value is `undefined` or `null`.\n" + "`onSelect` is required when `selectedIndex` is also set. Not doing so will " + "make the tabs not do anything, as `selectedIndex` indicates that you want to " + "handle the selected tab yourself.\n" + "If you only want to set the inital tab replace `selectedIndex` with `defaultIndex`.");
    }

    return error;
  }
  function selectedIndexPropType(props, propName, componentName, location, propFullName) {
    var prop = props[propName];
    var name = propFullName || propName;
    var error = null;

    if (prop != null && typeof prop !== 'number') {
      error = new Error("Invalid " + location + " `" + name + "` of type `" + typeof prop + "` supplied to " + ("`" + componentName + "`, expected `number`."));
    } else if (props.defaultIndex != null && prop != null) {
      return new Error("The " + location + " `" + name + "` cannot be used together with `defaultIndex` " + ("in `" + componentName + "`.\n") + ("Either remove `" + name + "` to let `" + componentName + "` handle the selected ") + "tab internally or remove `defaultIndex` to handle it yourself.");
    }

    return error;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var classnames = createCommonjsModule(function (module) {
    /*!
      Copyright (c) 2017 Jed Watson.
      Licensed under the MIT License (MIT), see
      http://jedwatson.github.io/classnames
    */

    /* global define */
    (function () {

      var hasOwn = {}.hasOwnProperty;

      function classNames() {
        var classes = [];

        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg) continue;
          var argType = typeof arg;

          if (argType === 'string' || argType === 'number') {
            classes.push(arg);
          } else if (Array.isArray(arg) && arg.length) {
            var inner = classNames.apply(null, arg);

            if (inner) {
              classes.push(inner);
            }
          } else if (argType === 'object') {
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          }
        }

        return classes.join(' ');
      }

      if ( module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else {
        window.classNames = classNames;
      }
    })();
  });

  // Get a universally unique identifier
  var count = 0;
  function uuid() {
    return "react-tabs-" + count++;
  }
  function reset() {
    count = 0;
  }

  function getTabsCount(children) {
    var tabCount = 0;
    deepForEach(children, function (child) {
      if (isTab(child)) tabCount++;
    });
    return tabCount;
  }
  function getPanelsCount(children) {
    var panelCount = 0;
    deepForEach(children, function (child) {
      if (isTabPanel(child)) panelCount++;
    });
    return panelCount;
  }

  function isNode(node) {
    return node && 'getAttribute' in node;
  } // Determine if a node from event.target is a Tab element


  function isTabNode(node) {
    return isNode(node) && node.getAttribute('role') === 'tab';
  } // Determine if a tab node is disabled


  function isTabDisabled(node) {
    return isNode(node) && node.getAttribute('aria-disabled') === 'true';
  }

  var canUseActiveElement;

  try {
    canUseActiveElement = !!(typeof window !== 'undefined' && window.document && window.document.activeElement);
  } catch (e) {
    // Work around for IE bug when accessing document.activeElement in an iframe
    // Refer to the following resources:
    // http://stackoverflow.com/a/10982960/369687
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12733599
    canUseActiveElement = false;
  }

  var UncontrolledTabs =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(UncontrolledTabs, _Component);

    function UncontrolledTabs() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.tabNodes = [];

      _this.handleKeyDown = function (e) {
        if (_this.isTabFromContainer(e.target)) {
          var index = _this.props.selectedIndex;
          var preventDefault = false;
          var useSelectedIndex = false;

          if (e.keyCode === 32 || e.keyCode === 13) {
            preventDefault = true;
            useSelectedIndex = false;

            _this.handleClick(e);
          }

          if (e.keyCode === 37 || e.keyCode === 38) {
            // Select next tab to the left
            index = _this.getPrevTab(index);
            preventDefault = true;
            useSelectedIndex = true;
          } else if (e.keyCode === 39 || e.keyCode === 40) {
            // Select next tab to the right
            index = _this.getNextTab(index);
            preventDefault = true;
            useSelectedIndex = true;
          } else if (e.keyCode === 35) {
            // Select last tab (End key)
            index = _this.getLastTab();
            preventDefault = true;
            useSelectedIndex = true;
          } else if (e.keyCode === 36) {
            // Select first tab (Home key)
            index = _this.getFirstTab();
            preventDefault = true;
            useSelectedIndex = true;
          } // This prevents scrollbars from moving around


          if (preventDefault) {
            e.preventDefault();
          } // Only use the selected index in the state if we're not using the tabbed index


          if (useSelectedIndex) {
            _this.setSelected(index, e);
          }
        }
      };

      _this.handleClick = function (e) {
        var node = e.target; // eslint-disable-next-line no-cond-assign

        do {
          if (_this.isTabFromContainer(node)) {
            if (isTabDisabled(node)) {
              return;
            }

            var index = [].slice.call(node.parentNode.children).filter(isTabNode).indexOf(node);

            _this.setSelected(index, e);

            return;
          }
        } while ((node = node.parentNode) != null);
      };

      return _this;
    }

    var _proto = UncontrolledTabs.prototype;

    _proto.setSelected = function setSelected(index, event) {
      // Check index boundary
      if (index < 0 || index >= this.getTabsCount()) return;
      var _this$props = this.props,
          onSelect = _this$props.onSelect,
          selectedIndex = _this$props.selectedIndex; // Call change event handler

      onSelect(index, selectedIndex, event);
    };

    _proto.getNextTab = function getNextTab(index) {
      var count = this.getTabsCount(); // Look for non-disabled tab from index to the last tab on the right

      for (var i = index + 1; i < count; i++) {
        if (!isTabDisabled(this.getTab(i))) {
          return i;
        }
      } // If no tab found, continue searching from first on left to index


      for (var _i = 0; _i < index; _i++) {
        if (!isTabDisabled(this.getTab(_i))) {
          return _i;
        }
      } // No tabs are disabled, return index


      return index;
    };

    _proto.getPrevTab = function getPrevTab(index) {
      var i = index; // Look for non-disabled tab from index to first tab on the left

      while (i--) {
        if (!isTabDisabled(this.getTab(i))) {
          return i;
        }
      } // If no tab found, continue searching from last tab on right to index


      i = this.getTabsCount();

      while (i-- > index) {
        if (!isTabDisabled(this.getTab(i))) {
          return i;
        }
      } // No tabs are disabled, return index


      return index;
    };

    _proto.getFirstTab = function getFirstTab() {
      var count = this.getTabsCount(); // Look for non disabled tab from the first tab

      for (var i = 0; i < count; i++) {
        if (!isTabDisabled(this.getTab(i))) {
          return i;
        }
      }

      return null;
    };

    _proto.getLastTab = function getLastTab() {
      var i = this.getTabsCount(); // Look for non disabled tab from the last tab

      while (i--) {
        if (!isTabDisabled(this.getTab(i))) {
          return i;
        }
      }

      return null;
    };

    _proto.getTabsCount = function getTabsCount$1() {
      var children = this.props.children;
      return getTabsCount(children);
    };

    _proto.getPanelsCount = function getPanelsCount$1() {
      var children = this.props.children;
      return getPanelsCount(children);
    };

    _proto.getTab = function getTab(index) {
      return this.tabNodes["tabs-" + index];
    };

    _proto.getChildren = function getChildren() {
      var _this2 = this;

      var index = 0;
      var _this$props2 = this.props,
          children = _this$props2.children,
          disabledTabClassName = _this$props2.disabledTabClassName,
          focus = _this$props2.focus,
          forceRenderTabPanel = _this$props2.forceRenderTabPanel,
          selectedIndex = _this$props2.selectedIndex,
          selectedTabClassName = _this$props2.selectedTabClassName,
          selectedTabPanelClassName = _this$props2.selectedTabPanelClassName;
      this.tabIds = this.tabIds || [];
      this.panelIds = this.panelIds || [];
      var diff = this.tabIds.length - this.getTabsCount(); // Add ids if new tabs have been added
      // Don't bother removing ids, just keep them in case they are added again
      // This is more efficient, and keeps the uuid counter under control

      while (diff++ < 0) {
        this.tabIds.push(uuid());
        this.panelIds.push(uuid());
      } // Map children to dynamically setup refs


      return deepMap(children, function (child) {
        var result = child; // Clone TabList and Tab components to have refs

        if (isTabList(child)) {
          var listIndex = 0; // Figure out if the current focus in the DOM is set on a Tab
          // If it is we should keep the focus on the next selected tab

          var wasTabFocused = false;

          if (canUseActiveElement) {
            wasTabFocused = React__default.Children.toArray(child.props.children).filter(isTab).some(function (tab, i) {
              return document.activeElement === _this2.getTab(i);
            });
          }

          result = React.cloneElement(child, {
            children: deepMap(child.props.children, function (tab) {
              var key = "tabs-" + listIndex;
              var selected = selectedIndex === listIndex;
              var props = {
                tabRef: function tabRef(node) {
                  _this2.tabNodes[key] = node;
                },
                id: _this2.tabIds[listIndex],
                panelId: _this2.panelIds[listIndex],
                selected: selected,
                focus: selected && (focus || wasTabFocused)
              };
              if (selectedTabClassName) props.selectedClassName = selectedTabClassName;
              if (disabledTabClassName) props.disabledClassName = disabledTabClassName;
              listIndex++;
              return React.cloneElement(tab, props);
            })
          });
        } else if (isTabPanel(child)) {
          var props = {
            id: _this2.panelIds[index],
            tabId: _this2.tabIds[index],
            selected: selectedIndex === index
          };
          if (forceRenderTabPanel) props.forceRender = forceRenderTabPanel;
          if (selectedTabPanelClassName) props.selectedClassName = selectedTabPanelClassName;
          index++;
          result = React.cloneElement(child, props);
        }

        return result;
      });
    };

    /**
     * Determine if a node from event.target is a Tab element for the current Tabs container.
     * If the clicked element is not a Tab, it returns false.
     * If it finds another Tabs container between the Tab and `this`, it returns false.
     */
    _proto.isTabFromContainer = function isTabFromContainer(node) {
      // return immediately if the clicked element is not a Tab.
      if (!isTabNode(node)) {
        return false;
      } // Check if the first occurrence of a Tabs container is `this` one.


      var nodeAncestor = node.parentElement;

      do {
        if (nodeAncestor === this.node) return true;
        if (nodeAncestor.getAttribute('data-tabs')) break;
        nodeAncestor = nodeAncestor.parentElement;
      } while (nodeAncestor);

      return false;
    };

    _proto.render = function render() {
      var _this3 = this;

      // Delete all known props, so they don't get added to DOM
      var _this$props3 = this.props,
          children = _this$props3.children,
          className = _this$props3.className,
          disabledTabClassName = _this$props3.disabledTabClassName,
          domRef = _this$props3.domRef,
          focus = _this$props3.focus,
          forceRenderTabPanel = _this$props3.forceRenderTabPanel,
          onSelect = _this$props3.onSelect,
          selectedIndex = _this$props3.selectedIndex,
          selectedTabClassName = _this$props3.selectedTabClassName,
          selectedTabPanelClassName = _this$props3.selectedTabPanelClassName,
          attributes = _objectWithoutPropertiesLoose(_this$props3, ["children", "className", "disabledTabClassName", "domRef", "focus", "forceRenderTabPanel", "onSelect", "selectedIndex", "selectedTabClassName", "selectedTabPanelClassName"]);

      return React__default.createElement("div", _extends({}, attributes, {
        className: classnames(className),
        onClick: this.handleClick,
        onKeyDown: this.handleKeyDown,
        ref: function ref(node) {
          _this3.node = node;
          if (domRef) domRef(node);
        },
        "data-tabs": true
      }), this.getChildren());
    };

    return UncontrolledTabs;
  }(React.Component);

  UncontrolledTabs.defaultProps = {
    className: 'react-tabs',
    focus: false
  };
  UncontrolledTabs.propTypes =  {
    children: childrenPropType,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    disabledTabClassName: PropTypes.string,
    domRef: PropTypes.func,
    focus: PropTypes.bool,
    forceRenderTabPanel: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    selectedTabClassName: PropTypes.string,
    selectedTabPanelClassName: PropTypes.string
  } ;

  var MODE_CONTROLLED = 0;
  var MODE_UNCONTROLLED = 1;

  var Tabs =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(Tabs, _Component);

    function Tabs(props) {
      var _this;

      _this = _Component.call(this, props) || this;

      _this.handleSelected = function (index, last, event) {
        var onSelect = _this.props.onSelect;
        var mode = _this.state.mode; // Call change event handler

        if (typeof onSelect === 'function') {
          // Check if the change event handler cancels the tab change
          if (onSelect(index, last, event) === false) return;
        }

        var state = {
          // Set focus if the change was triggered from the keyboard
          focus: event.type === 'keydown'
        };

        if (mode === MODE_UNCONTROLLED) {
          // Update selected index
          state.selectedIndex = index;
        }

        _this.setState(state);
      };

      _this.state = Tabs.copyPropsToState(_this.props, {}, props.defaultFocus);
      return _this;
    }

    Tabs.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
      return Tabs.copyPropsToState(props, state);
    };

    Tabs.getModeFromProps = function getModeFromProps(props) {
      return props.selectedIndex === null ? MODE_UNCONTROLLED : MODE_CONTROLLED;
    };

    // preserve the existing selectedIndex from state.
    // If the state has not selectedIndex, default to the defaultIndex or 0
    Tabs.copyPropsToState = function copyPropsToState(props, state, focus) {
      if (focus === void 0) {
        focus = false;
      }

      if ( state.mode !== undefined && state.mode !== Tabs.getModeFromProps(props)) {
        throw new Error("Switching between controlled mode (by using `selectedIndex`) and uncontrolled mode is not supported in `Tabs`.\nFor more information about controlled and uncontrolled mode of react-tabs see the README.");
      }

      var newState = {
        focus: focus,
        mode: Tabs.getModeFromProps(props)
      };

      if (newState.mode === MODE_UNCONTROLLED) {
        var maxTabIndex = getTabsCount(props.children) - 1;
        var selectedIndex = null;

        if (state.selectedIndex != null) {
          selectedIndex = Math.min(state.selectedIndex, maxTabIndex);
        } else {
          selectedIndex = props.defaultIndex || 0;
        }

        newState.selectedIndex = selectedIndex;
      }

      return newState;
    };

    var _proto = Tabs.prototype;

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          defaultIndex = _this$props.defaultIndex,
          defaultFocus = _this$props.defaultFocus,
          props = _objectWithoutPropertiesLoose(_this$props, ["children", "defaultIndex", "defaultFocus"]);

      var _this$state = this.state,
          focus = _this$state.focus,
          selectedIndex = _this$state.selectedIndex;
      props.focus = focus;
      props.onSelect = this.handleSelected;

      if (selectedIndex != null) {
        props.selectedIndex = selectedIndex;
      }

      return React__default.createElement(UncontrolledTabs, props, children);
    };

    return Tabs;
  }(React.Component);

  Tabs.defaultProps = {
    defaultFocus: false,
    forceRenderTabPanel: false,
    selectedIndex: null,
    defaultIndex: null
  };
  Tabs.propTypes =  {
    children: childrenPropType,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    defaultFocus: PropTypes.bool,
    defaultIndex: PropTypes.number,
    disabledTabClassName: PropTypes.string,
    domRef: PropTypes.func,
    forceRenderTabPanel: PropTypes.bool,
    onSelect: onSelectPropType,
    selectedIndex: selectedIndexPropType,
    selectedTabClassName: PropTypes.string,
    selectedTabPanelClassName: PropTypes.string
  } ;
  Tabs.tabsRole = 'Tabs';

  var TabList =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(TabList, _Component);

    function TabList() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = TabList.prototype;

    _proto.render = function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          attributes = _objectWithoutPropertiesLoose(_this$props, ["children", "className"]);

      return React__default.createElement("ul", _extends({}, attributes, {
        className: classnames(className),
        role: "tablist"
      }), children);
    };

    return TabList;
  }(React.Component);

  TabList.defaultProps = {
    className: 'react-tabs__tab-list'
  };
  TabList.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  } ;
  TabList.tabsRole = 'TabList';

  var DEFAULT_CLASS = 'react-tabs__tab';

  var Tab =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(Tab, _Component);

    function Tab() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = Tab.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.checkFocus();
    };

    _proto.componentDidUpdate = function componentDidUpdate() {
      this.checkFocus();
    };

    _proto.checkFocus = function checkFocus() {
      var _this$props = this.props,
          selected = _this$props.selected,
          focus = _this$props.focus;

      if (selected && focus) {
        this.node.focus();
      }
    };

    _proto.render = function render() {
      var _cx,
          _this = this;

      var _this$props2 = this.props,
          children = _this$props2.children,
          className = _this$props2.className,
          disabled = _this$props2.disabled,
          disabledClassName = _this$props2.disabledClassName,
          focus = _this$props2.focus,
          id = _this$props2.id,
          panelId = _this$props2.panelId,
          selected = _this$props2.selected,
          selectedClassName = _this$props2.selectedClassName,
          tabIndex = _this$props2.tabIndex,
          tabRef = _this$props2.tabRef,
          attributes = _objectWithoutPropertiesLoose(_this$props2, ["children", "className", "disabled", "disabledClassName", "focus", "id", "panelId", "selected", "selectedClassName", "tabIndex", "tabRef"]);

      return React__default.createElement("li", _extends({}, attributes, {
        className: classnames(className, (_cx = {}, _cx[selectedClassName] = selected, _cx[disabledClassName] = disabled, _cx)),
        ref: function ref(node) {
          _this.node = node;
          if (tabRef) tabRef(node);
        },
        role: "tab",
        id: id,
        "aria-selected": selected ? 'true' : 'false',
        "aria-disabled": disabled ? 'true' : 'false',
        "aria-controls": panelId,
        tabIndex: tabIndex || (selected ? '0' : null)
      }), children);
    };

    return Tab;
  }(React.Component);

  Tab.defaultProps = {
    className: DEFAULT_CLASS,
    disabledClassName: DEFAULT_CLASS + "--disabled",
    focus: false,
    id: null,
    panelId: null,
    selected: false,
    selectedClassName: DEFAULT_CLASS + "--selected"
  };
  Tab.propTypes =  {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    disabled: PropTypes.bool,
    tabIndex: PropTypes.string,
    disabledClassName: PropTypes.string,
    focus: PropTypes.bool,
    // private
    id: PropTypes.string,
    // private
    panelId: PropTypes.string,
    // private
    selected: PropTypes.bool,
    // private
    selectedClassName: PropTypes.string,
    tabRef: PropTypes.func // private

  } ;
  Tab.tabsRole = 'Tab';

  var DEFAULT_CLASS$1 = 'react-tabs__tab-panel';

  var TabPanel =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(TabPanel, _Component);

    function TabPanel() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = TabPanel.prototype;

    _proto.render = function render() {
      var _cx;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          forceRender = _this$props.forceRender,
          id = _this$props.id,
          selected = _this$props.selected,
          selectedClassName = _this$props.selectedClassName,
          tabId = _this$props.tabId,
          attributes = _objectWithoutPropertiesLoose(_this$props, ["children", "className", "forceRender", "id", "selected", "selectedClassName", "tabId"]);

      return React__default.createElement("div", _extends({}, attributes, {
        className: classnames(className, (_cx = {}, _cx[selectedClassName] = selected, _cx)),
        role: "tabpanel",
        id: id,
        "aria-labelledby": tabId
      }), forceRender || selected ? children : null);
    };

    return TabPanel;
  }(React.Component);

  TabPanel.defaultProps = {
    className: DEFAULT_CLASS$1,
    forceRender: false,
    selectedClassName: DEFAULT_CLASS$1 + "--selected"
  };
  TabPanel.propTypes =  {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    forceRender: PropTypes.bool,
    id: PropTypes.string,
    // private
    selected: PropTypes.bool,
    // private
    selectedClassName: PropTypes.string,
    tabId: PropTypes.string // private

  } ;
  TabPanel.tabsRole = 'TabPanel';

  exports.Tab = Tab;
  exports.TabList = TabList;
  exports.TabPanel = TabPanel;
  exports.Tabs = Tabs;
  exports.resetIdCounter = reset;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=react-tabs.development.js.map
