module.exports = (sequelize, Sequelize) => {
    const UserDetails = sequelize.define(
        'user_details',
        {
            user_details_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                field: 'first_name',
                type: Sequelize.STRING(255),
            },
            lastName: {
                field: 'last_name',
                type: Sequelize.STRING(255),
            },
            email: {
                field: 'email_id',
                type: Sequelize.STRING(255),
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                    isLowercase: true,
                },
            },
            organizationName: {
                field: 'organization_name',
                type: Sequelize.STRING(255),
            },
            sportId: {
                field: 'sport_id',
                type: Sequelize.BIGINT,
            },
            role: {
                field: 'role',
                type: Sequelize.STRING(255),
            },
            phoneNumber: {
                field: 'phone_number',
                type: Sequelize.STRING(255),
                unique: true,
                allowNull: true,
            },
            organization_id:
            {
                field: 'organization_id',
                type: Sequelize.BIGINT
            }

        })
    return UserDetails;
}

