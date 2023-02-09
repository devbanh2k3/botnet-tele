import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import ShowUpdate from './model/modelmodalShowBUpdate';
import { getDataAccount } from '../../services/userService';
import socketio from 'socket.io-client';
const socket = socketio('http://localhost:8080');
class UserManage extends Component {


    state = {
        user: '',
        isLoadingUpdate: false,
        isOpenModalShowUpdate: false,
        records: [],
        currentPage: 1,
        totalPages: 1,
        limit: 15,
        key: '',
        count: 0,
        namePC: '',
        nameProfile: '',
    }
    testSocket = () => {
        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        socket.on('test', (user) => {
            console.log(`New user: ${user}`);
            //alert(user)
            this.handlefetchData(false);
        });
    }
    componentDidMount() {

        this.handlefetchData(true);

    }

    toggleShopModalUpdate = () => {
        this.setState({
            isOpenModalShowUpdate: !this.state.isOpenModalShowUpdate,

        })
        this.handlefetchData(false);
    }
    handleOpenShowUpdate = (key, namepc, nameprofile) => {
        this.setState({
            isOpenModalShowUpdate: true,
            key: key,
            namePC: namepc,
            nameProfile: nameprofile
        }, () => {
            console.log(this.state.key)
        })
    }
    handlefetchData = async (check) => {
        if (check) {
            this.testSocket();
        }
        let response = await getDataAccount(this.state.currentPage, this.state.limit);
        console.log(response);
        if (response && response.errCode === 0) {
            this.setState({
                count: response.data.count,
                records: response.data.rows,
                totalPages: response.totalPages,
            })
        }

    }
    checkButton = (id) => {
        if (id === 0) {
            this.setState({
                currentPage: this.state.currentPage - 1
            }, () => {
                this.handlefetchData();
            })

        }
        else {
            this.setState({
                currentPage: this.state.currentPage + 1
            }, () => {
                this.handlefetchData();
            })

        }

    }
    handleChangLimit = (e) => {
        this.setState({
            currentPage: 1,
            limit: e.target.value
        }, () => {
            this.handlefetchData();
        })
    }
    render() {
        //this.handlefetchData();
        console.log(this.state.records)
        return (

            <div>
                {
                    this.state.isOpenModalShowUpdate && this.state.key &&
                    <ShowUpdate
                        keys={this.state.key}
                        namePCs={this.state.namePC}
                        nameProfiles={this.state.nameProfile}
                        isOpen={this.state.isOpenModalShowUpdate}
                        handleOpenShowUpdate={this.handleOpenShowUpdate}
                        toggleShopModal={this.toggleShopModalUpdate}
                    />
                }
                <form>
                    <label>
                        Limit:
                        <input type="number" value={this.state.limit} onChange={e => this.handleChangLimit(e)} />
                    </label>
                </form>
                <label>Tổng số account: {this.state.count}</label>
                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>id</th>
                            <th>Tên máy</th>
                            <th>serialnumber</th>
                            <th>profile</th>
                            <th>Tài khoản BM</th>
                            <th>Ngày sinh</th>
                            <th>uid</th>
                            <th>Số tài khoản</th>
                            <th>Ideal</th>
                            <th>Trạng thái</th>
                            <th>Thời gian lấy</th>
                            <th>Quốc gia</th>
                            <th>IP</th>
                            <th>Action</th>
                        </tr>
                        {
                            this.state.records && this.state.records.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.id}</td>
                                        <td>{item.machinename}</td>
                                        <td>{item.serialnumber}</td>
                                        <td>{item.profilename}</td>
                                        <td >{item.checkbm === 0 ? <i class="far fa-check-circle" style={{ color: "green" }}></i> : <i class="fas fa-ban" style={{ color: "red" }}></i>}</td>
                                        <td>{item.birthday}</td>
                                        <td>{item.uid}</td>
                                        <td>{item.countaccount}</td>
                                        <td>{item.Ideal}</td>
                                        <td>{item.status} ({item.update})</td>
                                        <td>{item.pickdate}</td>
                                        <td>{item.country}</td>
                                        <td>{item.ip}</td>
                                        <td>
                                            <button onClick={() => this.handleOpenShowUpdate(item.key, item.machinename, item.profilename)} className='btn-show-report'><i className="far fa-address-book"></i></button>
                                        </td>
                                    </tr>

                                )

                            })
                        }
                    </table>
                </div>
                <div >

                    <span className="pagination-info">
                        Page: {this.state.currentPage} of {this.state.totalPages}
                    </span>

                    <button
                        disabled={this.state.currentPage === 1}
                        onClick={() => this.checkButton(0)}
                    >
                        Previous
                    </button>
                    <button
                        disabled={this.state.currentPage === this.state.totalPages}
                        onClick={() => this.checkButton()}
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
