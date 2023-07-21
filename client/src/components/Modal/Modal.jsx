import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import useInputValues from 'hooks/useInput'
import { updateFirstList, updateSecondList } from 'redux/menuSlice';
import 'styles/Modal/Modal.css';

const Modal = ({ isOpen, setIsOpen }) => {
  const { btn } = useSelector((state) => state.btn);
  const { firstList, secondList } = useSelector((state) => state.menu);
  const { inputValues, handleChange, reset}= useInputValues({
    title:"",
    link:"",
    new_window: 0
  })
  const {title,link,new_window} = inputValues

  const parent_id = btn ? Number(btn.slice(2)) : null;
  const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다.

  const closeModal = () => {
    if (btn === '메뉴') {
      reset();
      setIsOpen(false);
    } else {
      reset();
      setIsOpen(false);
    }
  };

  const handleModalContentClick = (event) => {
    event.stopPropagation();
  };

  const addMenu = () => {
    const saveParentMenu = async () => {
      if (title === '') {
        alert('페이지 명을 정해 주세요');
        return;
      }
      try {
        const res = await fetch('/api/insertMenu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title }),
        });
        const data = await res.json();

        if (!res.ok) {
          alert('오류입니다. 다시 시도해 주세요');
          return;
        }
        alert('메뉴를 추가하였습니다.');
        setIsOpen(false);
        reset();
        dispatch(updateFirstList([...firstList, data]));
      } catch (err) {
        console.error(err);
      }
    };

  

    const saveMenu = async () => {
      if (title === '' || link === '') {
        alert('페이지 명 또는 링크를 적어주세요');
        return;
      }
      try {
        const res = await fetch('/api/insertMenu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title, link, parent_id, new_window }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data);
          return;
        }
        alert('메뉴를 추가하였습니다.');
        setIsOpen(false);
        reset();
        dispatch(updateSecondList([...secondList, data]));
      } catch (err) {
        console.error(err);
      }
    };

    if (btn === '메뉴') {
      saveParentMenu();
    } else {
      saveMenu();
    }
  };

  return (
    <>
      {isOpen && (
        <div className='modal-overlay' onClick={closeModal}>
          <div className='modal-content' onClick={handleModalContentClick}>
            <div className='modal_infor_box'>
              <span>{btn !== '메뉴' && btn !== '복제' ? '메뉴 항목 추가' : `페이지 ${btn}`}</span>
              <input type='text' className='pageInput' name='title' placeholder={btn === '메뉴' ? '메뉴 항목' : `페이지 명`} value={title} onChange={handleChange} />
              {btn !== '메뉴' && <input type='text' className='pageInput' name='link' placeholder='페이지 주소' value={link} onChange={handleChange} />}
              {btn !== '메뉴' && (
                <div className='modal_page_infor'>
                  <p>{`http://localhost:3000/page/${link}`}</p>
                  <div>
                    <input type='checkbox' name='new_window' checked={new_window} onChange={handleChange} />
                    새창 열기
                  </div>
                </div>
              )}
            </div>
            <div className='modal_btn_box'>
              <button onClick={closeModal}>닫기</button>
              <button onClick={addMenu}>저장</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

