'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _checkedIcon = require('../assets/checked-icon.png');

var _checkedIcon2 = _interopRequireDefault(_checkedIcon);

var _uncheckedIcon = require('../assets/unchecked-icon.png');

var _uncheckedIcon2 = _interopRequireDefault(_uncheckedIcon);

var _reactDebounceInput = require('react-debounce-input');

var _fetchAPI = require('../fetchAPI');

var _fetchAPI2 = _interopRequireDefault(_fetchAPI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Group = function (_Component) {
  _inherits(Group, _Component);

  function Group() {
    var _temp, _this, _ret;

    _classCallCheck(this, Group);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.state = {
      nameGroup: '',
      avatarUrl: 'https://epicqueststore.com/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png',
      companyPicked: null,
      searching: false,
      users: [],
      companies: [],
      usersChecked: [],
      companyGroupEdit: null,
      search: '',
      edit: false
    }, _this.fetchCompanies = function () {
      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = '/users/companies';
      return (0, _fetchAPI2.default)(baseURL, url, 'GET');
    }, _this.fetchUser = function () {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;


      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = '/users/by-company';

      var params = {
        search: _this.state.search,
        companyId: _this.state.companyPicked,
        page: page
      };

      (0, _fetchAPI2.default)(baseURL, url, 'GET', params).then(function (res) {
        _this.setState({
          users: res.data.users
        });
      }).catch(function (err) {
        console.error('err fetchUser: ', err);
      });
    }, _this.handleSearch = function (e) {
      var search = e.target.value;
      _this.setState({ search: search, searching: true }, function () {
        _this.fetchUser();
      });
    }, _this.onPickUser = function (user) {
      var isChecked = _this.state.usersChecked.filter(function (userA) {
        return userA._id === user._id;
      }).length > 0;
      if (!isChecked) {
        _this.setState({
          usersChecked: [].concat(_this.state.usersChecked, [user])
        });
      } else {
        var newUserChecked = _this.state.usersChecked.filter(function (userC) {
          return userC._id !== user._id;
        });
        _this.setState({ usersChecked: newUserChecked });
      }
    }, _this.removeUserChecked = function (user) {
      var newUserChecked = _this.state.usersChecked.filter(function (userC) {
        return userC._id !== user._id;
      });
      _this.setState({ usersChecked: newUserChecked });
    }, _this.handleChangeNameGroup = function (e) {
      _this.setState({
        nameGroup: e.target.value
      });
    }, _this.onCreateGroup = function () {
      var _this$state = _this.state,
          usersChecked = _this$state.usersChecked,
          companyPicked = _this$state.companyPicked,
          nameGroup = _this$state.nameGroup,
          avatarUrl = _this$state.avatarUrl;


      if (!nameGroup) {
        alert('Enter your name group!');
        return;
      }

      var userIds = usersChecked.map(function (user) {
        return user._id;
      });

      var data = {
        userIds: userIds,
        companyId: companyPicked,
        name: nameGroup,
        avatarUrl: avatarUrl
      };

      _this.props._createGroup(data).then(function (response) {
        _this.setState({
          usersChecked: [],
          nameGroup: ''
        });
        if (response && response.status === 200) {
          _this.props.handleUpdateRoom(response.data.result);
          _this.props.handleCancel();
        }
      }).catch(function (err) {
        console.error('err _createGroup: ', err);
      });
    }, _this.onEditGroup = function () {
      var _this$state2 = _this.state,
          usersChecked = _this$state2.usersChecked,
          companyPicked = _this$state2.companyPicked,
          nameGroup = _this$state2.nameGroup,
          avatarUrl = _this$state2.avatarUrl;

      var userIds = usersChecked.map(function (user) {
        return user._id;
      });

      var data = {
        roomId: _this.props.groupInfo._id,
        userIds: userIds,
        company: companyPicked,
        name: nameGroup,
        avatarUrl: avatarUrl
      };

      _this.props._editGroup(data).then(function () {
        _this.setState({
          usersChecked: [],
          nameGroup: ''
        });
        _this.props.handleCancel();
      }).catch(function (err) {
        console.error('err _editGroup: ', err);
      });
    }, _this.onChangeCompany = function (idCompany) {
      _this.setState({
        companyPicked: idCompany,
        usersChecked: []
      }, function () {
        _this.fetchUser();
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Group.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.groupInfo) {
      return;
    }

    this.fetchCompanies().then(function (res) {
      var companies = res.data;
      if (companies.length <= 0) return;

      _this2.setState({
        companies: companies,
        companyPicked: companies[0]._id
      }, function () {
        _this2.fetchUser();
      });
    }).catch(function (err) {
      console.error('err fetchUser: ', err);
    });
  };

  Group.prototype.componentWillMount = function componentWillMount() {
    var _this3 = this;

    if (this.props.groupInfo) {
      var _props$groupInfo = this.props.groupInfo,
          name = _props$groupInfo.name,
          members = _props$groupInfo.members,
          companyId = _props$groupInfo.companyId,
          avatarUrl = _props$groupInfo.avatarUrl;


      if (!name || !members || !companyId) return;

      var baseURL = process.env.API_SERVER_SOCKET + '/api/v1';
      var url = '/groups/company/' + companyId;
      var usersChecked = members.map(function (member) {
        return member.userInfo;
      }).filter(function (member) {
        return member._id !== _this3.props.currentUserId;
      });

      (0, _fetchAPI2.default)(baseURL, url, 'GET').then(function (res) {
        _this3.setState({
          companyGroupEdit: res.data.result,
          nameGroup: name,
          usersChecked: usersChecked,
          companyPicked: companyId,
          avatarUrl: avatarUrl,
          edit: true
        }, function () {
          _this3.fetchUser();
        });
      });
    }
  };

  Group.prototype.render = function render() {
    var _this4 = this;

    var listIdChecked = this.state.usersChecked.map(function (user) {
      return user._id;
    });
    var canSubmit = this.state.usersChecked.length >= 2 && this.state.nameGroup.length > 0;
    var edit = this.state.edit;
    return _react2.default.createElement(
      'div',
      { className: 'create-group-box' },
      _react2.default.createElement(
        'div',
        { className: 'content' },
        _react2.default.createElement(
          'div',
          { className: 'header' },
          _react2.default.createElement(
            'h5',
            null,
            edit ? 'Sửa nhóm' : 'Tạo nhóm'
          ),
          _react2.default.createElement(
            'p',
            { style: { cursor: 'pointer' }, onClick: this.props.handleCancel, className: 'closeIcon' },
            'X'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'body-content' },
          _react2.default.createElement(
            'div',
            { className: 'name-group-input-box' },
            _react2.default.createElement('img', {
              src: this.state.avatarUrl,
              alt: 'group user',
              style: { width: 38, marginLeft: 10 }
            }),
            _react2.default.createElement('input', {
              onChange: this.handleChangeNameGroup,
              value: this.state.nameGroup,
              placeholder: 'T\xEAn nh\xF3m.'
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'main-content' },
            _react2.default.createElement(
              'div',
              { className: 'list-user-box' },
              _react2.default.createElement(
                'div',
                { className: 'search_user' },
                _react2.default.createElement(_reactDebounceInput.DebounceInput, {
                  onChange: this.handleSearch,
                  minLength: 2,
                  debounceTimeout: 300,
                  placeholder: 'T\xECm ki\u1EBFm ng\u01B0\u1EDDi \u0111\u1EC3 th\xEAm.'
                })
              ),
              _react2.default.createElement(
                'div',
                { className: 'list-user' },
                this.state.users.map(function (user, index) {
                  var isChecked = listIdChecked.indexOf(user._id) !== -1;
                  return _react2.default.createElement(UserItem, { key: index, onPickUser: _this4.onPickUser, isChecked: isChecked, user: user });
                })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'list-select' },
              _react2.default.createElement(
                'div',
                { style: { height: edit ? '90%' : '65%' }, className: 'list-user-picked' },
                this.state.usersChecked.map(function (user, index) {
                  return _react2.default.createElement(UserChecked, { key: index, removeUserChecked: _this4.removeUserChecked, user: user });
                })
              ),
              !edit ? _react2.default.createElement(
                'div',
                { className: 'list-company' },
                _react2.default.createElement(
                  'ul',
                  null,
                  this.state.companies.map(function (company, index) {
                    return _react2.default.createElement(
                      'li',
                      { onClick: _this4.onChangeCompany.bind(null, company._id), key: index },
                      _react2.default.createElement(
                        'p',
                        null,
                        company.name
                      ),
                      _react2.default.createElement('input', {
                        name: 'company',
                        type: 'radio',
                        value: company._id,
                        checked: _this4.state.companyPicked === company._id,
                        onChange: _this4.onChangeCompany.bind(null, company._id)
                      })
                    );
                  })
                )
              ) : _react2.default.createElement(
                'div',
                { style: { display: 'flex', alignItems: 'center', height: '10%' } },
                _react2.default.createElement(
                  'div',
                  { style: { fontSize: 13, paddingLeft: 10 } },
                  _react2.default.createElement('img', {
                    style: { maxHeight: 30 },
                    src: this.state.companyGroupEdit.logo,
                    alt: 'company' }),
                  this.state.companyGroupEdit.name
                )
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'footer' },
          _react2.default.createElement(
            'button',
            { className: 'btn-cancer', onClick: this.props.handleCancel },
            'H\u1EE7y'
          ),
          edit ? _react2.default.createElement(
            'button',
            { disabled: !canSubmit, className: 'btn-update', onClick: this.onEditGroup },
            'S\u1EEDa'
          ) : _react2.default.createElement(
            'button',
            { disabled: !canSubmit, className: 'btn-create', onClick: this.onCreateGroup },
            'T\u1EA1o'
          )
        )
      )
    );
  };

  return Group;
}(_react.Component);

exports.default = Group;


function UserItem(_ref) {
  var user = _ref.user,
      isChecked = _ref.isChecked,
      onPickUser = _ref.onPickUser;

  return _react2.default.createElement(
    'div',
    { onClick: function onClick() {
        return onPickUser(user);
      }, className: 'user-items' },
    _react2.default.createElement(
      'div',
      { className: 'user-items-info', style: { display: 'flex' } },
      _react2.default.createElement('img', { src: user.profile.avatar, alt: 'user' }),
      _react2.default.createElement(
        'p',
        null,
        user.profile.fullName
      )
    ),
    _react2.default.createElement('img', { className: 'icon_checkbox', src: isChecked ? _checkedIcon2.default : _uncheckedIcon2.default, alt: 'checkbox' })
  );
}

function UserChecked(_ref2) {
  var user = _ref2.user,
      removeUserChecked = _ref2.removeUserChecked;

  return _react2.default.createElement(
    'div',
    { onClick: function onClick() {
        return removeUserChecked(user);
      }, className: 'user-items' },
    _react2.default.createElement(
      'div',
      { className: 'user-items-info', style: { display: 'flex' } },
      _react2.default.createElement('img', { src: user.profile.avatar, alt: 'user' }),
      _react2.default.createElement(
        'p',
        null,
        user.profile.fullName
      )
    ),
    _react2.default.createElement(
      'p',
      { className: 'icon-remove-user' },
      'X'
    )
  );
}
module.exports = exports['default'];