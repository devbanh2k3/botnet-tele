import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDataAccountKey } from '../../../services/userService';

class modalShowBUpdate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records2: [],
            currentPage: 1,
            totalPages: 1,
            limit: 1,
            count: 0,
        }
    }

    componentDidMount() {
        //load danh sách theo key
        console.log(this.props.keys)
        this.loadAccountKey()
    }
    loadAccountKey = async () => {
        let response = await getDataAccountKey(this.state.currentPage, this.state.limit, this.props.keys);
        console.log('data model', response);
        if (response && response.errCode === 0) {
            this.setState({
                count: response.data.count,
                records2: response.data.rows,
                totalPages: response.totalPages,
            })
        }

    }

    checkButton = (id) => {
        if (id === 0) {
            this.setState({
                currentPage: this.state.currentPage - 1
            }, () => {
                this.loadAccountKey();
            })

        }
        else {
            this.setState({
                currentPage: this.state.currentPage + 1
            }, () => {
                this.loadAccountKey();
            })

        }

    }
    toggle = () => {
        this.props.toggleShopModal();

    }
    handleChangLimit = (e) => {
        this.setState({
            currentPage: 1,
            limit: e.target.value
        }, () => {
            this.loadAccountKey();
        })
    }
    render() {
        console.log('model', this.state.records2)
        return (

            <Modal size='xl' isOpen={this.props.isOpen} className={'modal-shop-container'}>
                <ModalHeader toggle={() => { this.toggle() }} >Phân tích</ModalHeader>
                <ModalBody>
                    <form>
                        <label>
                            Limit:
                            <input type="number" value={this.state.limit} onChange={e => this.handleChangLimit(e)} />
                        </label>
                    </form>
                    <label>Lịch sử update: {this.state.count}</label>
                    <label>Tên Máy: {this.props.namePCs} </label>
                    <label>Tên profile: {this.props.nameProfiles} </label>

                    <div className='user-table mt-1 mx-1 '>
                        <table id="customers">
                            <tr>

                                <th>Tài khoản BM</th>
                                <th>Ngày sinh</th>
                                <th>uid</th>
                                <th>Số tài khoản</th>
                                <th>Ideal</th>
                                <th>Trạng thái</th>
                                <th>Ngày cập nhật</th>
                                <th>Quốc gia</th>
                                <th>IP</th>
                            </tr>
                            {
                                this.state.records2 && this.state.records2.map((item, index) => {
                                    return (
                                        <tr>
                                            <td >{item.checkbm === 0 ? <i class="far fa-check-circle" style={{ color: "green" }}></i> : <i class="fas fa-ban" style={{ color: "red" }}></i>}</td>
                                            <td>{item.birthday}</td>
                                            <td>{item.uid}</td>
                                            <td>{item.countaccount}</td>
                                            <td>{item.Ideal}</td>
                                            <td>{item.status}</td>
                                            <td>{item.pickdate}</td>
                                            <td>{item.country}</td>
                                            <td>{item.ip}</td>
                                        </tr>

                                    )

                                })
                            }
                        </table>
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
                                disabled={this.state.currentPage >= this.state.totalPages}
                                onClick={() => this.checkButton()}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    {/* <Button color="#841584"  >Tạo ngay</Button> */}
                    {/* <Button color='#841584' onClick={() => { this.toggle() }}>cancel</Button> */}
                </ModalFooter>
            </Modal >
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(modalShowBUpdate);
