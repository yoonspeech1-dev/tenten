// 웰컴텐텐 - 출산 준비 앱
class WelcomeTenTen {
    constructor() {
        this.categories = [];
        this.currentCategory = null;
        this.currentItemType = null;
        this.editingItemIndex = null;
        this.currentBuyer = null;
        this.currentPurchaseStatus = null;

        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.renderCategories();
    }

    // 로컬스토리지에서 데이터 로드
    loadData() {
        const saved = localStorage.getItem('welcomeTenTen');
        if (saved) {
            try {
                this.categories = JSON.parse(saved);
            } catch (e) {
                console.error('데이터 로드 실패:', e);
                this.categories = [];
            }
        }
    }

    // 로컬스토리지에 데이터 저장
    saveData() {
        try {
            localStorage.setItem('welcomeTenTen', JSON.stringify(this.categories));
        } catch (e) {
            console.error('데이터 저장 실패:', e);
            alert('데이터 저장에 실패했습니다.');
        }
    }

    // 이벤트 바인딩
    bindEvents() {
        // 카테고리 추가 버튼
        document.getElementById('btnAddCategory').addEventListener('click', () => {
            this.openAddCategoryModal();
        });

        // 카테고리 모달 닫기
        document.getElementById('btnCloseModal').addEventListener('click', () => {
            this.closeAddCategoryModal();
        });
        document.getElementById('btnCancelCategory').addEventListener('click', () => {
            this.closeAddCategoryModal();
        });

        // 카테고리 저장
        document.getElementById('btnSaveCategory').addEventListener('click', () => {
            this.saveCategory();
        });

        // 카테고리 타입 선택
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.currentItemType = e.currentTarget.dataset.type;
            });
        });

        // 아이템 모달 닫기
        document.getElementById('btnCloseItemModal').addEventListener('click', () => {
            this.closeAddItemModal();
        });
        document.getElementById('btnCancelItem').addEventListener('click', () => {
            this.closeAddItemModal();
        });

        // 아이템 저장
        document.getElementById('btnSaveItem').addEventListener('click', () => {
            this.saveItem();
        });

        // 아이템 추가 버튼
        document.getElementById('btnAddItem').addEventListener('click', () => {
            this.openAddItemModal();
        });

        // 카테고리 상세 모달 닫기
        document.getElementById('btnCloseCategoryDetail').addEventListener('click', () => {
            this.closeCategoryDetailModal();
        });
        document.getElementById('btnCloseCategoryDetailBottom').addEventListener('click', () => {
            this.closeCategoryDetailModal();
        });

        // 카테고리 삭제
        document.getElementById('btnDeleteCategory').addEventListener('click', () => {
            this.deleteCategory();
        });

        // 가격 옵션 변경
        document.querySelectorAll('input[name="priceOption"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const actualPriceInput = document.getElementById('actualPrice');
                if (e.target.value === 'custom') {
                    actualPriceInput.disabled = false;
                    actualPriceInput.focus();
                } else {
                    actualPriceInput.disabled = true;
                    actualPriceInput.value = '';
                }
            });
        });

        // 구매자 선택
        document.querySelectorAll('.buyer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.buyer-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.currentBuyer = e.currentTarget.dataset.buyer;
            });
        });

        // 모달 배경 클릭시 닫기
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    // 카테고리 추가 모달 열기
    openAddCategoryModal() {
        document.getElementById('categoryName').value = '';
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
        this.currentItemType = null;
        document.getElementById('modalAddCategory').classList.add('active');
    }

    // 카테고리 추가 모달 닫기
    closeAddCategoryModal() {
        document.getElementById('modalAddCategory').classList.remove('active');
    }

    // 카테고리 저장
    saveCategory() {
        const name = document.getElementById('categoryName').value.trim();

        if (!name) {
            alert('카테고리 이름을 입력해주세요.');
            return;
        }

        if (!this.currentItemType) {
            alert('카테고리 유형을 선택해주세요.');
            return;
        }

        const category = {
            id: Date.now(),
            name: name,
            type: this.currentItemType,
            items: [],
            createdAt: new Date().toISOString()
        };

        this.categories.push(category);
        this.saveData();
        this.renderCategories();
        this.closeAddCategoryModal();
    }

    // 카테고리 렌더링
    renderCategories() {
        const container = document.getElementById('categoriesContainer');

        if (this.categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🍼</div>
                    <div class="empty-state-text">
                        아직 카테고리가 없어요<br>
                        텐텐이를 위한 준비를 시작해볼까요?
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.categories.map(category => {
            const stats = this.getCategoryStats(category);
            return `
                <div class="category-card" data-id="${category.id}">
                    <div class="category-header">
                        <div class="category-name">${this.escapeHtml(category.name)}</div>
                        <div class="category-type-badge ${category.type === 'checklist' ? 'badge-checklist' : 'badge-shopping'}">
                            ${category.type === 'checklist' ? '✓ 체크리스트' : '🛒 구매리스트'}
                        </div>
                    </div>
                    <div class="category-stats">
                        ${category.type === 'checklist' ?
                            `<div class="stat-item">완료: ${stats.completed}/${stats.total}</div>` :
                            `<div class="stat-item">항목: ${stats.total}개</div>
                             <div class="stat-item">금액: ${this.formatPrice(stats.totalPrice)}</div>`
                        }
                    </div>
                </div>
            `;
        }).join('');

        // 카테고리 클릭 이벤트
        container.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.openCategoryDetail(id);
            });
        });
    }

    // 카테고리 통계
    getCategoryStats(category) {
        const stats = {
            total: category.items.length,
            completed: 0,
            totalPrice: 0
        };

        category.items.forEach(item => {
            if (category.type === 'checklist') {
                if (item.completed) stats.completed++;
            } else {
                const price = item.actualPrice || item.price || 0;
                stats.totalPrice += price;
            }
        });

        return stats;
    }

    // 카테고리 상세 열기
    openCategoryDetail(id) {
        const category = this.categories.find(c => c.id === id);
        if (!category) return;

        this.currentCategory = category;
        document.getElementById('categoryDetailTitle').textContent = category.name;
        this.renderItems();
        document.getElementById('modalCategoryDetail').classList.add('active');
    }

    // 카테고리 상세 닫기
    closeCategoryDetailModal() {
        document.getElementById('modalCategoryDetail').classList.remove('active');
        this.currentCategory = null;
    }

    // 아이템 렌더링
    renderItems() {
        const container = document.getElementById('itemsList');
        const totalPriceContainer = document.getElementById('totalPrice');

        if (!this.currentCategory) return;

        if (this.currentCategory.items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">항목을 추가해보세요</div>
                </div>
            `;
            totalPriceContainer.style.display = 'none';
            return;
        }

        if (this.currentCategory.type === 'checklist') {
            container.innerHTML = this.currentCategory.items.map((item, index) => `
                <div class="item-card ${item.completed ? 'completed' : ''}">
                    <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''} data-index="${index}">
                    <div class="item-content">
                        <div class="item-name">${this.escapeHtml(item.name)}</div>
                    </div>
                    <button class="btn-delete-item" data-index="${index}">×</button>
                </div>
            `).join('');

            // 체크박스 이벤트
            container.querySelectorAll('.item-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.toggleItem(index);
                });
            });

            totalPriceContainer.style.display = 'none';
        } else {
            let totalPrice = 0;
            container.innerHTML = this.currentCategory.items.map((item, index) => {
                const price = item.actualPrice || item.price || 0;
                totalPrice += price;
                const hasDiscount = item.actualPrice && item.actualPrice !== item.price;

                const status = item.purchaseStatus || 'planned';
                const linkPreview = item.linkPreview;

                return `
                    <div class="item-card">
                        <div class="item-content">
                            <div class="item-name">${this.escapeHtml(item.name)}</div>
                            <div class="item-details">
                                ${hasDiscount ?
                                    `<span class="item-price discounted">${this.formatPrice(item.price)}</span>
                                     <span class="item-actual-price">${this.formatPrice(item.actualPrice)}</span>` :
                                    `<span class="item-price">${this.formatPrice(item.price)}</span>`
                                }
                                ${item.buyer ? `<span class="buyer-badge ${item.buyer}">${item.buyer === 'mom' ? '👩🏻 Mom' : '👨🏻 Dad'}</span>` : ''}
                                <label class="purchase-status-toggle">
                                    <input type="checkbox" class="purchase-status-checkbox" data-index="${index}" ${status === 'completed' ? 'checked' : ''}>
                                    <span class="status-text">${status === 'completed' ? '✅ 구매완료' : '📋 구매예정'}</span>
                                </label>
                            </div>
                            ${item.link ? `
                                <a href="${item.link}" class="link-preview-card" target="_blank" rel="noopener" onclick="event.stopPropagation()">
                                    ${linkPreview && linkPreview.image ? `<img src="${linkPreview.image}" class="link-preview-image" alt="${this.escapeHtml(item.name)}" onerror="this.style.display='none'">` : ''}
                                    <div class="link-preview-content">
                                        <div class="link-preview-title">${this.escapeHtml(item.name)}</div>
                                        ${linkPreview && linkPreview.description ? `<div class="link-preview-description">${this.escapeHtml(linkPreview.description)}</div>` : ''}
                                        <div class="link-preview-url">${this.escapeHtml(item.link)}</div>
                                    </div>
                                </a>
                            ` : ''}
                        </div>
                        <div class="item-actions">
                            <button class="btn-edit-item" data-index="${index}">✏️</button>
                            <button class="btn-delete-item" data-index="${index}">×</button>
                        </div>
                    </div>
                `;
            }).join('');

            document.getElementById('totalAmount').textContent = this.formatPrice(totalPrice);
            totalPriceContainer.style.display = 'flex';
        }

        // 수정 버튼 이벤트
        container.querySelectorAll('.btn-edit-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                this.editItem(index);
            });
        });

        // 삭제 버튼 이벤트
        container.querySelectorAll('.btn-delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                this.deleteItem(index);
            });
        });

        // 구매 상태 체크박스 이벤트
        container.querySelectorAll('.purchase-status-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index);
                this.togglePurchaseStatus(index);
            });
        });
    }

    // 아이템 토글 (체크리스트)
    toggleItem(index) {
        if (!this.currentCategory) return;
        this.currentCategory.items[index].completed = !this.currentCategory.items[index].completed;
        this.saveData();
        this.renderItems();
        this.renderCategories();
    }

    // 아이템 삭제
    deleteItem(index) {
        if (!this.currentCategory) return;
        if (!confirm('이 항목을 삭제하시겠습니까?')) return;

        this.currentCategory.items.splice(index, 1);
        this.saveData();
        this.renderItems();
        this.renderCategories();
    }

    // 아이템 추가 모달 열기
    openAddItemModal() {
        if (!this.currentCategory) return;

        this.editingItemIndex = null;
        document.getElementById('itemModalTitle').textContent = '항목 추가';

        // 타입에 따라 입력 필드 표시 및 초기화
        if (this.currentCategory.type === 'checklist') {
            // 체크리스트 타입
            document.getElementById('checklistInputs').style.display = 'block';
            document.getElementById('shoppingInputs').style.display = 'none';
            document.getElementById('checklistItemName').value = '';
        } else {
            // 구매 리스트 타입
            document.getElementById('checklistInputs').style.display = 'none';
            document.getElementById('shoppingInputs').style.display = 'block';

            // 입력 필드 초기화
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('actualPrice').value = '';
            document.getElementById('productLink').value = '';
            document.getElementById('productImage').value = '';
            document.querySelector('input[name="priceOption"][value="same"]').checked = true;
            document.getElementById('actualPrice').disabled = true;

            // 구매자 및 구매 완료 체크박스 초기화
            document.querySelectorAll('.buyer-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('purchaseCompleted').checked = false;
            this.currentBuyer = null;
        }

        document.getElementById('modalAddItem').classList.add('active');
    }

    // 아이템 추가 모달 닫기
    closeAddItemModal() {
        document.getElementById('modalAddItem').classList.remove('active');
    }

    // 아이템 저장
    saveItem() {
        if (!this.currentCategory) return;

        let item;

        if (this.currentCategory.type === 'checklist') {
            const name = document.getElementById('checklistItemName').value.trim();
            if (!name) {
                alert('할 일을 입력해주세요.');
                return;
            }
            item = {
                name: name,
                completed: false,
                createdAt: new Date().toISOString()
            };
        } else {
            const name = document.getElementById('productName').value.trim();
            const price = parseFloat(document.getElementById('productPrice').value) || 0;
            const priceOption = document.querySelector('input[name="priceOption"]:checked').value;
            const actualPrice = priceOption === 'custom' ?
                parseFloat(document.getElementById('actualPrice').value) || 0 : price;
            const link = document.getElementById('productLink').value.trim();
            const imageUrl = document.getElementById('productImage').value.trim();

            if (!name) {
                alert('제품명을 입력해주세요.');
                return;
            }

            if (!this.currentBuyer) {
                alert('등록자를 선택해주세요.');
                return;
            }

            const isCompleted = document.getElementById('purchaseCompleted').checked;

            // 링크 미리보기 정보 생성
            let linkPreview = null;
            if (link) {
                try {
                    const urlObj = new URL(link);
                    const domain = urlObj.hostname.replace('www.', '');
                    linkPreview = {
                        title: name,
                        description: `${domain}에서 확인하기`,
                        image: imageUrl || null,
                        url: link
                    };
                } catch (e) {
                    linkPreview = null;
                }
            }

            item = {
                name: name,
                price: price,
                actualPrice: priceOption === 'custom' ? actualPrice : null,
                link: link || null,
                linkPreview: linkPreview,
                buyer: this.currentBuyer,
                purchaseStatus: isCompleted ? 'completed' : 'planned',
                createdAt: new Date().toISOString()
            };
        }

        if (this.editingItemIndex !== null) {
            // 수정 모드
            this.currentCategory.items[this.editingItemIndex] = item;
            this.editingItemIndex = null;
        } else {
            // 새로 추가
            this.currentCategory.items.push(item);
        }

        this.saveData();
        this.renderItems();
        this.renderCategories();
        this.closeAddItemModal();
    }

    // 카테고리 삭제
    deleteCategory() {
        if (!this.currentCategory) return;

        if (!confirm(`"${this.currentCategory.name}" 카테고리를 삭제하시겠습니까?\n모든 항목이 함께 삭제됩니다.`)) {
            return;
        }

        this.categories = this.categories.filter(c => c.id !== this.currentCategory.id);
        this.saveData();
        this.renderCategories();
        this.closeCategoryDetailModal();
    }

    // 아이템 수정
    editItem(index) {
        if (!this.currentCategory) return;
        const item = this.currentCategory.items[index];
        if (!item) return;

        this.editingItemIndex = index;
        document.getElementById('itemModalTitle').textContent = '항목 수정';

        if (this.currentCategory.type === 'checklist') {
            document.getElementById('checklistInputs').style.display = 'block';
            document.getElementById('shoppingInputs').style.display = 'none';
            document.getElementById('checklistItemName').value = item.name;
        } else {
            document.getElementById('checklistInputs').style.display = 'none';
            document.getElementById('shoppingInputs').style.display = 'block';

            document.getElementById('productName').value = item.name;
            document.getElementById('productPrice').value = item.price || 0;
            document.getElementById('productLink').value = item.link || '';

            if (item.actualPrice && item.actualPrice !== item.price) {
                document.querySelector('input[name="priceOption"][value="custom"]').checked = true;
                document.getElementById('actualPrice').disabled = false;
                document.getElementById('actualPrice').value = item.actualPrice;
            } else {
                document.querySelector('input[name="priceOption"][value="same"]').checked = true;
                document.getElementById('actualPrice').disabled = true;
                document.getElementById('actualPrice').value = '';
            }

            // 구매자 선택
            document.querySelectorAll('.buyer-btn').forEach(btn => {
                if (btn.dataset.buyer === item.buyer) {
                    btn.classList.add('selected');
                    this.currentBuyer = item.buyer;
                } else {
                    btn.classList.remove('selected');
                }
            });

            // 이미지 URL 로드
            if (item.linkPreview && item.linkPreview.image) {
                document.getElementById('productImage').value = item.linkPreview.image;
            }

            // 구매 완료 체크박스
            document.getElementById('purchaseCompleted').checked = item.purchaseStatus === 'completed';
        }

        document.getElementById('modalAddItem').classList.add('active');
    }

    // 구매 상태 토글
    togglePurchaseStatus(index) {
        if (!this.currentCategory) return;
        const item = this.currentCategory.items[index];
        if (!item) return;

        item.purchaseStatus = item.purchaseStatus === 'completed' ? 'planned' : 'completed';
        this.saveData();
        this.renderItems();
        this.renderCategories();
    }

    // 링크 미리보기 가져오기
    async fetchLinkPreview(url) {
        // 간단한 URL 파싱으로 도메인 추출
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.replace('www.', '');

            // 실제 구현에서는 서버 API를 통해 Open Graph 정보를 가져와야 하지만,
            // 여기서는 클라이언트 전용이므로 기본 정보만 저장
            return {
                title: `${domain}의 상품`,
                description: url,
                image: null,
                url: url
            };
        } catch (e) {
            return null;
        }
    }

    // 가격 포맷
    formatPrice(price) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price);
    }

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new WelcomeTenTen();
});
