import { Form, FormInstance, Input, Modal, Space, Tag, message } from "antd";
import { useState } from "react";
import detailsStyle from "../../userDetails/userDetails.module.scss";
import MemoizedTag from "../MemoizedTag/index";

type CustomTagProps = {
    tagKey: number;
    children: string;
    color: string;
    checked: boolean;
    onClose?: () => void;
};

type HobbySectionProps = {
    form: FormInstance;
    hobbiesProp: string[];
};

const tagColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "purple"];

const HobbySection: React.FC<HobbySectionProps> = ({ form, hobbiesProp }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [hobbies, setHobbies] = useState<string[]>(hobbiesProp);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const addHobby = (value: string) => {
        setHobbies([...hobbies, value]);
    };

    const removeHobby = (hobby: string) => {
        setHobbies(hobbies.filter((item) => item !== hobby));
    };

    const handleCancel = () => {
        setIsModalVisible(false);

        form.setFieldsValue({
            hobbies: [...hobbies],
        });
    };

    const getRandomColor = () => {
        const availableColors = tagColors.filter((color) => !selectedColors.includes(color));
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const selectedColor = availableColors[randomIndex];
        // Lưu trữ màu sắc đã chọn vào danh sách màu sắc đã được chọn
        setSelectedColors([...selectedColors, selectedColor]);
        return selectedColor;
    };

    const handleSelectHobbies = (hobby: string) => {
        if (!selectedHobbies.includes(hobby)) {
            setSelectedHobbies([...selectedHobbies, hobby]);
        } else {
            setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
        }
    };

    const renderHobbies = (hobbiesToRender: string[], closable = true) => {
        return hobbiesToRender?.map((hobby, index) => {
            const tagProps: CustomTagProps = {
                tagKey: index,
                children: hobby,
                color: selectedColors[index] || getRandomColor(),
                checked: false,
                onClose: () => removeHobby(hobby),
            };
            return <MemoizedTag {...tagProps} key={index} />;
        });
    };

    return (
        <Form.Item name="hobbies" initialValue={hobbies} className={detailsStyle["user__details--interest"]}>
            {contextHolder}
            <div className={detailsStyle["user__details--interest"]}>
                <div className={detailsStyle["user__details--interest__title"]}>
                    <span>Sở thích</span>
                    <span
                        className={detailsStyle["user__details--interest__title--edit"]}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Chỉnh sửa
                    </span>

                    <Modal
                        title="Thêm sở thích"
                        open={isModalVisible}
                        closable={false}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <Input.Search
                            placeholder="Nhập sở thích của bạn"
                            enterButton="Thêm"
                            onSearch={(value) => {
                                hobbies.length >= 10 &&
                                    message.open({
                                        content: "Số lượng sở thích tối đa bạn có thể đặt là 10",
                                        type: "warning",
                                    });
                                hobbies.length < 10 && value.length !== 0 && addHobby(value);
                            }}
                        />
                        <Space style={{ marginTop: "1rem" }}>
                            <div>{renderHobbies(hobbies)}</div>
                        </Space>
                    </Modal>
                </div>
            </div>

            <div>{renderHobbies(hobbies)}</div>
        </Form.Item>
    );
};

export default HobbySection;
