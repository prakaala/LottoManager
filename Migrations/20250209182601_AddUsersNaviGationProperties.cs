using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LottoManager.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersNaviGationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Users",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Users_GasStationID",
                table: "Users",
                column: "GasStationID");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_GasStations_GasStationID",
                table: "Users",
                column: "GasStationID",
                principalTable: "GasStations",
                principalColumn: "gasStationID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_GasStations_GasStationID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_GasStationID",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Users");
        }
    }
}
