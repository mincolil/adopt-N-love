import { useRef, useState, useEffect, useCallback } from "react";
// Axios
import axios from "axios";
import { toast } from "react-toastify";
import ModalAddPet from "../../../components/Modal/ModalAddPet";
import ModalEditPet from "../../../components/Modal/ModalEditPet";

//ant
import { Table, Tag, InputNumber } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words'
import { ToastContainer } from "react-toastify";

// -------------------------------STYLE MODAL----------------------
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// -------------------------------API SERVER----------------------
const BASE_URL = "http://localhost:3500";

export default function CategoryTable() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  // --------------------- MODAL HANDLE -----------------------------
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [dataEditPet, setDataEditPet] = useState({});

  // --------------------- CLOSE MODAL  -----------------------------
  const handleCloseModal = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
  };

  // ----------------------------------- API GET ALL CATEGORY --------------------------------
  useEffect(() => {
    loadAllCategory(currentPage);
  }, [currentPage]);

  const loadAllCategory = async (page) => {
    try {
      const response = await axios.get(`${BASE_URL}/category?categoryName=Dịch vụ`);
      if (response.error) {
        toast.error(response.error);
      } else {
        setData(response.data.docs);
        setOriginalData(response.data.docs); // Store original data
      }
    } catch (err) {
      console.log(err);
    }
  };

  //----------------------------- SAVE ------------------------------
  const handleSave = async (record) => {
    try {
      const updateSlot = await axios.patch(`${BASE_URL}/category`, {
        id: record._id,
        slot: record.slot
      });
      toast.success("Data saved successfully!");
      setOriginalData(data);
    } catch (error) {
      toast.error("Failed to save data!");
    }
  };

  // --------------------- ANT TABLE -----------------------------
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex, field) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (field == 'name') {
        return record.userId.fullname.toLowerCase().includes(value.toLowerCase());
      } else if (field == 'phone') {
        return record.userId.phone.toLowerCase().includes(value.toLowerCase());
      } else {
        if (record[dataIndex]) return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      }

    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Loại',
      dataIndex: 'categoryName',
      ...getColumnSearchProps('categoryName'),
      width: '30%',
      key: 'categoryName',
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      sortOrder: sortedInfo.columnKey === 'categoryName' ? sortedInfo.order : null,
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'feature',
      ...getColumnSearchProps('feature'),
      width: '30%',
      key: 'feature',
      sorter: (a, b) => a.feature.length - b.feature.length,
      sortOrder: sortedInfo.columnKey === 'feature' ? sortedInfo.order : null,
    },
    {
      title: 'Số phòng',
      key: 'action',
      width: '15%',
      render: (text, record) => (
        <InputNumber min={1} defaultValue={record.slot}
          onChange={(value) => {
            const newData = data.map((item) =>
              item._id === record._id ? { ...item, slot: value } : item
            );
            setData(newData);
          }} />
      ),

    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            disabled={record.slot === originalData.find((item) => item._id === record._id)?.slot}
            onClick={() => handleSave(record)}
          >
            Lưu
          </Button>
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    setSortedInfo(sorter);
  };

  return (
    <>
      <ToastContainer />

      <Table columns={columns} dataSource={data} onChange={onChange} />;
      {/* Modal create */}
      <ModalAddPet
        open={openCreateModal}
        onClose={handleCloseModal}
        handUpdateTable={loadAllCategory}
        page={currentPage}
      />
      {/* Modal update */}
      <ModalEditPet
        open={openEditModal}
        onClose={handleCloseModal}
        dataEditPet={dataEditPet}
        handUpdateEditTable={loadAllCategory}
        page={currentPage}
      />
    </>
  );
}
