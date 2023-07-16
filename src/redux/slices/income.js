import {createSlice} from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import {dispatch} from '../store';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    incomes: [],
    isOpenModal: false,
    selectedIncomeId: null,
};

const slice = createSlice({
    name: 'income',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // GET INCOMES
        getIncomesSuccess(state, action) {
            state.isLoading = false;
            state.incomes = action.payload;
        },

        // CREATE INCOME
        createIncomeSuccess(state, action) {
            const newIncome = action.payload;
            state.isLoading = false;
            state.incomes = [...state.incomes, newIncome];
        },

        // UPDATE INCOME
        updateIncomeSuccess(state, action) {
            const income = action.payload;
            const updateIncome = state.incomes.map((_event) => {
                if (_event.id === income.id) {
                    return income;
                }
                return _event;
            });

            state.isLoading = false;
            state.incomes = updateIncome;
        },

        // DELETE INCOME
        deleteIncomeSuccess(state, action) {
            const {incomeId} = action.payload;
            state.incomes = state.incomes.filter((event) => event.id !== incomeId);
        },

        // SELECT INCOME
        selectIncome(state, action) {
            const incomeId = action.payload;
            state.isOpenModal = true;
            state.selectedIncomeId = incomeId;
        },

        // SELECT RANGE
        // selectRange(state, action) {
        //   const { start, end } = action.payload;
        //   state.isOpenModal = true;
        //   state.selectedRange = { start, end };
        // },

        // OPEN MODAL
        openModal(state) {
            state.isOpenModal = true;
        },

        // CLOSE MODAL
        closeModal(state) {
            state.isOpenModal = false;
            state.selectedIncomeId = null;
        },
    },
});

// Reducer
export default slice.reducer;

// Actions
export const {openModal, closeModal, selectIncome} = slice.actions;

// ----------------------------------------------------------------------

export function getIncomes() {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.get('/getAllIncomes');
            dispatch(slice.actions.getIncomesSuccess(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function createIncome(newIncome) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.post('/createIncome', {
                title: newIncome.title,
                category: newIncome.category,
                "card_id": newIncome.card,
                price: newIncome.price,
                date: newIncome.date,
                description: newIncome.description,
                tag: newIncome.textColor
            });
            dispatch(slice.actions.createIncomeSuccess(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function updateIncome(incomeId, updateIncome) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            const response = await axios.post('/api/calendar/incomes/update', {
                incomeId,
                updateIncome,
            });
            dispatch(slice.actions.updateIncomeSuccess(response.data.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function deleteIncome(incomeId) {
    return async () => {
        dispatch(slice.actions.startLoading());
        try {
            await axios.post('/api/calendar/incomes/delete', {incomeId});
            dispatch(slice.actions.deleteIncomeSuccess({incomeId}));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
    return async () => {
        dispatch(
            slice.actions.selectRange({
                start: start.getTime(),
                end: end.getTime(),
            })
        );
    };
}
