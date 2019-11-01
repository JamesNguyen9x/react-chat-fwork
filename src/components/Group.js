import React, { Component } from 'react';
import iconChecked from '../assets/checked-icon.png';
import iconUnchecked from '../assets/unchecked-icon.png';
import { DebounceInput } from 'react-debounce-input';
import fetchAPI from '../fetchAPI';
export default class Group extends Component {

  state = {
    nameGroup : '',
    avatarUrl: 'https://epicqueststore.com/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-group.png',
    companyPicked: null,
    searching: false,
    users : [],
    companies: [],
    usersChecked: [],
    companyGroupEdit: null,
    search: '',
    edit: false
  };

  componentDidMount () {
    if (this.props.groupInfo) {
      return;
    }

    this.fetchCompanies().then(res => {
      let companies = res.data;
      if (companies.length <= 0) return;

      this.setState({
        companies ,
        companyPicked: companies[0]._id
      }, () => {
        this.fetchUser();
      });
    }).catch(err => {
      console.error('err fetchUser: ', err);
    });
  }

  componentWillMount() {
    if (this.props.groupInfo) {
      let { name, members, companyId, avatarUrl } = this.props.groupInfo;

      if ( !name || !members || !companyId ) return;

      const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
      const url = `/groups/company/${companyId}`;
      const usersChecked = members.map(member => member.userInfo).filter(member => member._id !== this.props.currentUserId);

      fetchAPI(baseURL, url, 'GET').then(res => {
        this.setState({
          companyGroupEdit: res.data.result,
          nameGroup: name,
          usersChecked,
          companyPicked: companyId,
          avatarUrl: avatarUrl,
          edit: true
        }, () => {
          this.fetchUser();
        });
      });
    }
  }

  fetchCompanies = () => {
    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/users/companies`;
    return fetchAPI(baseURL, url, 'GET');
  }

  fetchUser = ( page = 1) => {

    const baseURL = `${process.env.CHAT_BACKEND_URL}/api/v1/chat`;
    const url = `/users/by-company`;

    let params = {
      search : this.state.search,
      companyId: this.state.companyPicked,
      page
    };

    fetchAPI(baseURL, url, 'GET', params).then(res => {
      this.setState({
        users: res.data.users
      });
    }).catch(err => {
      console.error('err fetchUser: ', err);
    });
  }

  handleSearch = (e) => {
    let search = e.target.value;
    this.setState( { search, searching: true }, () => {
      this.fetchUser();
    } );
  };

  onPickUser = (user) => {
    let isChecked = this.state.usersChecked.filter(userA => userA._id === user._id).length > 0;
    if ( !isChecked ) {
      this.setState({
        usersChecked: [...this.state.usersChecked, user]
      });
    } else {
      let newUserChecked = this.state.usersChecked.filter(userC => userC._id !== user._id);
      this.setState({usersChecked: newUserChecked});
    }
  }

  removeUserChecked = (user) => {
    let newUserChecked = this.state.usersChecked.filter(userC => userC._id !== user._id);
    this.setState({usersChecked: newUserChecked});
  }

  handleChangeNameGroup = (e) => {
    this.setState({
      nameGroup: e.target.value
    });
  }

  onCreateGroup = () => {
    let { usersChecked, companyPicked, nameGroup, avatarUrl } = this.state;

    if (!nameGroup) {
      alert('Enter your name group!');
      return;
    }

    let userIds = usersChecked.map(user => user._id);

    let data = {
      userIds,
      companyId: companyPicked,
      name : nameGroup,
      avatarUrl: avatarUrl
    };

    this.props._createGroup(data).then(response => {
      this.setState({
        usersChecked: [],
        nameGroup: ''
      });
      if (response && response.status === 200) {
        this.props.handleUpdateRoom(response.data.result);
        this.props.handleCancel();
      }
    }).catch(err => {
      console.error('err _createGroup: ', err);
    });
  }

  onEditGroup = () => {
    let { usersChecked, companyPicked, nameGroup, avatarUrl } = this.state;
    let userIds = usersChecked.map(user => user._id);

    let data = {
      roomId: this.props.groupInfo._id,
      userIds,
      company: companyPicked,
      name : nameGroup,
      avatarUrl: avatarUrl
    };

    this.props._editGroup(data).then(() => {
      this.setState({
        usersChecked: [],
        nameGroup: ''
      });
      this.props.handleCancel();
    }).catch(err => {
      console.error('err _editGroup: ', err);
    });
  }

  onChangeCompany = (idCompany) => {
    this.setState({
      companyPicked: idCompany,
      usersChecked: []
    }, () => {
      this.fetchUser();
    });
  };

  render() {
    const listIdChecked = this.state.usersChecked.map(user => user._id);
    const canSubmit = this.state.usersChecked.length >= 2 && this.state.nameGroup.length > 0;
    const edit = this.state.edit;
    return (
      <div className="create-group-box">
        <div className="content">
          <div className="header">
            <h5>{edit ? 'Sửa nhóm' : 'Tạo nhóm'}</h5>
            <p style={{cursor: 'pointer'}} onClick={this.props.handleCancel} className="closeIcon">X</p>
          </div>
          <div className="body-content">
            <div className="name-group-input-box">
              <img
                src={this.state.avatarUrl}
                alt="group user"
                style={{width: 38, marginLeft: 10}}
              />
              <input
                onChange={this.handleChangeNameGroup}
                value={this.state.nameGroup}
                placeholder="Tên nhóm."
              />
            </div>
            <div className="main-content">
              <div className="list-user-box">
                <div className="search_user">
                  <DebounceInput
                    onChange={this.handleSearch}
                    minLength={2}
                    debounceTimeout={300}
                    placeholder="Tìm kiếm người để thêm."
                  />
                </div>
                <div className="list-user">
                  {this.state.users.map((user, index) => {
                    let isChecked = listIdChecked.indexOf(user._id) !== -1;
                    return (<UserItem key={index} onPickUser={this.onPickUser} isChecked={isChecked} user={user}/>);
                  }
                  )}
                </div>
              </div>
              <div className="list-select">
                <div style={{height: edit ? '90%' : '65%' }} className="list-user-picked">
                  {this.state.usersChecked.map((user, index) =>
                    (<UserChecked key={index} removeUserChecked={this.removeUserChecked} user={user}/>)
                  )}
                </div>
                {!edit ? (<div className="list-company">
                  <ul>
                    {this.state.companies.map( (company, index) =>
                      <li onClick={this.onChangeCompany.bind(null, company._id)} key={index}>
                        <p>{company.name}</p>
                        <input
                          name="company"
                          type="radio"
                          value={company._id}
                          checked={this.state.companyPicked === company._id}
                          onChange={this.onChangeCompany.bind(null, company._id)}
                        />
                      </li>
                    )}
                  </ul>
                </div>) : (
                  <div style={{display: 'flex', alignItems: 'center', height: '10%'}}>
                    <div style={{fontSize: 13, paddingLeft: 10}}><img
                      style={{maxHeight: 30}}
                      src={this.state.companyGroupEdit.logo}
                      alt="company"/>{this.state.companyGroupEdit.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="footer">
            <button className="btn-cancer" onClick={this.props.handleCancel}>Hủy</button>
            {edit ?
              <button disabled={!canSubmit} className="btn-update" onClick={this.onEditGroup}>Sửa</button> :
              <button disabled={!canSubmit} className="btn-create" onClick={this.onCreateGroup}>Tạo</button>
            }
          </div>
        </div>
      </div>
    );
  }
}

function UserItem({ user, isChecked, onPickUser }) {
  return (
    <div onClick={() => onPickUser(user)} className="user-items">
      <div className="user-items-info" style={{display: 'flex'}}>
        <img src={user.profile.avatar} alt="user"/>
        <p>{user.profile.fullName}</p>
      </div>
      <img className="icon_checkbox" src={isChecked ? iconChecked : iconUnchecked} alt="checkbox"/>
    </div>
  );
}

function UserChecked({ user, removeUserChecked }) {
  return (
    <div onClick={() => removeUserChecked(user)} className="user-items">
      <div className="user-items-info" style={{display: 'flex'}}>
        <img src={user.profile.avatar} alt="user"/>
        <p>{user.profile.fullName}</p>
      </div>
      <p className="icon-remove-user">X</p>
    </div>
  );
}
