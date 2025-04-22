import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Checkbox, message, Card, List, Space, Typography, Divider } from 'antd';
import { CheckOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Text, Title } = Typography;

// URL API từ back-end (localhost:5000)
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Hàm tính màu và icon dựa trên trạng thái và deadline
const getTaskStatus = (completed, deadline) => {
  if (completed) return {
    color: '#52c41a',
    bgColor: '#f6ffed',
    icon: <CheckOutlined />,
    text: 'Hoàn thành'
  };

  const now = new Date();
  const due = new Date(deadline);
  const diff = (due - now) / (1000 * 60 * 60 * 24);

  if (diff < 0) return {
    color: '#f5222d',
    bgColor: '#fff1f0',
    icon: <ExclamationCircleOutlined />,
    text: 'Quá hạn'
  };

  if (diff <= 1) return {
    color: '#faad14',
    bgColor: '#fffbe6',
    icon: <ClockCircleOutlined />,
    text: 'Gần hạn'
  };

  return {
    color: '#d9d9d9',
    bgColor: '#fafafa',
    icon: null,
    text: 'Bình thường'
  };
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách công việc');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (values) => {
    try {
      await axios.post(`${API}/tasks`, values);
      form.resetFields();
      fetchTasks();
      message.success('Đã thêm công việc');
    } catch (error) {
      message.error('Lỗi khi thêm công việc');
    }
  };

  const addSubtask = async (taskId, subTitle, subDeadline) => {
    try {
      await axios.post(`${API}/tasks/${taskId}/subtasks`, {
        title: subTitle,
        deadline: subDeadline,
      });
      fetchTasks();
      message.success('Đã thêm công việc con');
    } catch (error) {
      message.error('Lỗi khi thêm công việc con');
    }
  };

  const toggleComplete = async (type, id, completed) => {
    try {
      await axios.put(`${API}/tasks/${type}/${id}`, { completed: !completed });
      fetchTasks();
      message.success(`${type === 'task' ? 'Công việc' : 'Công việc con'} đã được cập nhật`);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Title level={2} className="text-center mb-6">Quản Lý Công Việc</Title>
      
      <Card title="Thêm công việc mới" className="mb-6">
        <Form form={form} onFinish={addTask} layout="vertical">
          <Space direction="vertical" size="middle" className="w-full">
            <Form.Item
              name="title"
              label="Tên công việc"
              rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
            >
              <Input placeholder="Nhập tên công việc" />
            </Form.Item>
            
            <Form.Item
              name="deadline"
              label="Hạn chót"
              rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            
            <Button type="primary" htmlType="submit" block>
              Thêm công việc
            </Button>
          </Space>
        </Form>
      </Card>

      <Card title="Danh sách công việc" loading={loading}>
        <List
          itemLayout="vertical"
          dataSource={tasks}
          renderItem={(task) => {
            const status = getTaskStatus(task.completed, task.deadline);
            return (
              <List.Item
                key={task.id}
                style={{ backgroundColor: status.bgColor, padding: '16px', marginBottom: '16px', borderRadius: '8px' }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Space align="center">
                      <Checkbox 
                        checked={task.completed}
                        onChange={() => toggleComplete('task', task.id, task.completed)}
                      />
                      <Text strong delete={task.completed}>{task.title}</Text>
                      {status.icon && (
                        <Space style={{ color: status.color }}>
                          {status.icon}
                          <Text type="secondary">{status.text}</Text>
                        </Space>
                      )}
                    </Space>
                    <div className="mt-1">
                      <Text type="secondary">Hạn chót: {new Date(task.deadline).toLocaleString()}</Text>
                    </div>
                  </div>
                </div>

                <Divider orientation="left" plain className="mt-4 mb-3">
                  Công việc con
                </Divider>

                <SubtaskForm onAdd={(title, deadline) => addSubtask(task.id, title, deadline)} />

                {task.subtasks.length > 0 && (
                  <List
                    dataSource={task.subtasks}
                    renderItem={(st) => {
                      const subStatus = getTaskStatus(st.completed, st.deadline);
                      return (
                        <List.Item
                          key={st.id}
                          style={{ 
                            backgroundColor: subStatus.bgColor,
                            padding: '12px',
                            margin: '8px 0',
                            borderRadius: '6px'
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <Space>
                              <Checkbox 
                                checked={st.completed}
                                onChange={() => toggleComplete('subtask', st.id, st.completed)}
                              />
                              <Text delete={st.completed}>- {st.title}</Text>
                              {subStatus.icon && (
                                <Space style={{ color: subStatus.color }}>
                                  {subStatus.icon}
                                  <Text type="secondary">{subStatus.text}</Text>
                                </Space>
                              )}
                            </Space>
                            <Text type="secondary">
                              {new Date(st.deadline).toLocaleString()}
                            </Text>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                )}
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}

function SubtaskForm({ onAdd }) {
  const [form] = Form.useForm();

  const handleAddSubtask = async (values) => {
    try {
      await onAdd(values.title, values.deadline);
      form.resetFields();
    } catch (error) {
      message.error('Lỗi khi thêm công việc con');
    }
  };

  return (
    <Form form={form} onFinish={handleAddSubtask} layout="vertical">
      <Space direction="vertical" size="middle" className="w-full">
        <Form.Item
          name="title"
          label="Tên công việc con"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc con' }]}
        >
          <Input placeholder="Nhập tên công việc con" />
        </Form.Item>
        
        <Form.Item
          name="deadline"
          label="Hạn chót"
          rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        
        <Button type="dashed" htmlType="submit" block>
          Thêm công việc con
        </Button>
      </Space>
    </Form>
  );
}